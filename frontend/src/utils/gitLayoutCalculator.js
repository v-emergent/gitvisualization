/**
 * Git Graph Layout Calculator
 * 
 * Provides utility functions to calculate proper layout positions
 * for Git visualization elements (commits, branches, HEAD)
 */

// Constants for layout
const HORIZONTAL_SPACING = 250; // Space between commits in X direction (increased for clarity)
const VERTICAL_SPACING = 150;   // Space between parallel branches in Y direction (increased for clarity)
const BRANCH_X_OFFSET = 120;    // X offset for branch labels
const BRANCH_Y_OFFSET = -50;    // Y offset for branch labels
const HEAD_X_OFFSET = -100;     // X offset for HEAD pointer
const HEAD_Y_OFFSET = -50;      // Y offset for HEAD pointer
const INITIAL_X = 200;          // X position for initial commit
const INITIAL_Y = 250;          // Y position for initial commit

/**
 * Calculate positions for all elements in a Git repository
 * This is the main function that handles the layout algorithm
 */
export function calculateRepositoryLayout(repository) {
  // Clone the repository to avoid mutating the original
  const repositoryCopy = JSON.parse(JSON.stringify(repository));
  
  // Skip if repository is not initialized
  if (!repositoryCopy.initialized) {
    return repositoryCopy;
  }
  
  // Find the root commits (commits with no parents)
  const rootCommitIds = findRootCommits(repositoryCopy.commits);
  
  // Track which lanes are occupied at each x position
  const occupiedLanes = {};
  
  // Assign lanes to each commit through a topological sort
  const commitLanes = {};
  const processedCommits = new Set();
  
  // Process root commits first
  rootCommitIds.forEach((commitId, index) => {
    const y = INITIAL_Y + (index * VERTICAL_SPACING);
    repositoryCopy.commits[commitId].x = INITIAL_X;
    repositoryCopy.commits[commitId].y = y;
    commitLanes[commitId] = index;
    processedCommits.add(commitId);
    
    // Mark the lane as occupied
    if (!occupiedLanes[INITIAL_X]) {
      occupiedLanes[INITIAL_X] = new Set();
    }
    occupiedLanes[INITIAL_X].add(index);
  });
  
  // Process the rest of the commits in topological order
  let remaining = Object.keys(repositoryCopy.commits).filter(id => !processedCommits.has(id));
  let progress = true;
  
  while (remaining.length > 0 && progress) {
    progress = false;
    
    const newRemaining = [];
    
    for (const commitId of remaining) {
      const commit = repositoryCopy.commits[commitId];
      
      // Check if all parents are processed
      const allParentsProcessed = commit.parents && commit.parents.every(parentId => 
        processedCommits.has(parentId)
      );
      
      if (allParentsProcessed) {
        progress = true;
        processedCommits.add(commitId);
        
        // Calculate position based on parents
        positionCommit(commit, repositoryCopy.commits, commitLanes, occupiedLanes);
      } else {
        newRemaining.push(commitId);
      }
    }
    
    remaining = newRemaining;
  }
  
  // Handle branch positioning
  Object.entries(repositoryCopy.branches).forEach(([branchName, commitId], index) => {
    const targetCommit = repositoryCopy.commits[commitId];
    if (targetCommit) {
      const lane = commitLanes[commitId] || 0;
      const xOffset = BRANCH_X_OFFSET;
      // Stagger branches vertically to avoid overlap - more space between them
      const yOffset = BRANCH_Y_OFFSET + (index % 3) * 50; 
      
      // Store position in the branch object
      if (!repositoryCopy.branchPositions) {
        repositoryCopy.branchPositions = {};
      }
      
      repositoryCopy.branchPositions[branchName] = {
        x: targetCommit.x + xOffset,
        y: targetCommit.y + yOffset,
        lane
      };
    }
  });
  
  // Handle HEAD positioning
  if (repositoryCopy.HEAD) {
    let targetId;
    let targetType;
    
    if (repositoryCopy.HEAD.type === 'branch') {
      targetId = repositoryCopy.HEAD.reference;
      targetType = 'branch';
    } else {
      targetId = repositoryCopy.HEAD.reference;
      targetType = 'commit';
    }
    
    let targetX, targetY;
    
    if (targetType === 'branch' && repositoryCopy.branchPositions && repositoryCopy.branchPositions[targetId]) {
      targetX = repositoryCopy.branchPositions[targetId].x;
      targetY = repositoryCopy.branchPositions[targetId].y;
    } else if (targetType === 'commit' && repositoryCopy.commits[targetId]) {
      targetX = repositoryCopy.commits[targetId].x;
      targetY = repositoryCopy.commits[targetId].y;
    }
    
    if (targetX !== undefined && targetY !== undefined) {
      // Store HEAD position
      repositoryCopy.headPosition = {
        x: targetX + HEAD_X_OFFSET,
        y: targetY + HEAD_Y_OFFSET
      };
    }
  }

  // Add index/staging area and working directory positions
  repositoryCopy.indexPosition = {
    x: INITIAL_X + HORIZONTAL_SPACING * 0.5,
    y: INITIAL_Y - VERTICAL_SPACING * 1.5
  };

  repositoryCopy.workingDirPosition = {
    x: INITIAL_X,
    y: INITIAL_Y - VERTICAL_SPACING * 1.5
  };
  
  return repositoryCopy;
}

/**
 * Position a commit based on its parents
 */
function positionCommit(commit, commits, commitLanes, occupiedLanes) {
  if (!commit.parents || commit.parents.length === 0) {
    // This is a root commit, should be positioned already
    return;
  }
  
  // Find the maximum x position among parents
  let maxParentX = 0;
  let totalParentY = 0;
  let parentCount = 0;
  
  for (const parentId of commit.parents) {
    const parent = commits[parentId];
    if (parent) {
      maxParentX = Math.max(maxParentX, parent.x);
      totalParentY += parent.y;
      parentCount++;
    }
  }
  
  // Calculate the X position (always to the right of all parents)
  const x = maxParentX + HORIZONTAL_SPACING;
  
  // For merge commits, try to position in between the parents
  let y;
  let lane;
  
  if (commit.parents.length > 1) {
    // This is a merge commit
    // Calculate average Y of parents
    y = totalParentY / parentCount;
    
    // Find an available lane near the calculated y position
    lane = findAvailableLane(occupiedLanes, x, y);
    y = INITIAL_Y + (lane * VERTICAL_SPACING);
  } else {
    // Regular commit, try to continue in the same lane as the parent
    const parentId = commit.parents[0];
    const parentLane = commitLanes[parentId];
    
    if (parentLane !== undefined) {
      // Try to use the same lane as parent if possible
      if (!occupiedLanes[x] || !occupiedLanes[x].has(parentLane)) {
        lane = parentLane;
        y = INITIAL_Y + (lane * VERTICAL_SPACING);
      } else {
        // Lane is occupied, find another one
        lane = findAvailableLane(occupiedLanes, x, INITIAL_Y + (parentLane * VERTICAL_SPACING));
        y = INITIAL_Y + (lane * VERTICAL_SPACING);
      }
    } else {
      // Fallback if parent lane is not defined
      lane = findAvailableLane(occupiedLanes, x, INITIAL_Y);
      y = INITIAL_Y + (lane * VERTICAL_SPACING);
    }
  }
  
  // Update the commit's position
  commit.x = x;
  commit.y = y;
  commitLanes[commit.id] = lane;
  
  // Mark the lane as occupied
  if (!occupiedLanes[x]) {
    occupiedLanes[x] = new Set();
  }
  occupiedLanes[x].add(lane);
}

/**
 * Find root commits (commits with no parents)
 */
function findRootCommits(commits) {
  return Object.keys(commits).filter(id => 
    !commits[id].parents || commits[id].parents.length === 0
  );
}

/**
 * Find an available lane at a given x position, close to a target y position
 */
function findAvailableLane(occupiedLanes, x, targetY) {
  // Calculate target lane based on the targetY
  const targetLane = Math.round((targetY - INITIAL_Y) / VERTICAL_SPACING);
  
  // If no lanes are occupied at this x position, use the target lane
  if (!occupiedLanes[x]) {
    return targetLane;
  }
  
  // If the target lane is available, use it
  if (!occupiedLanes[x].has(targetLane)) {
    return targetLane;
  }
  
  // Find the closest available lane
  let lane = targetLane;
  let offset = 1;
  
  while (true) {
    // Try lane above
    if (!occupiedLanes[x].has(targetLane + offset)) {
      return targetLane + offset;
    }
    
    // Try lane below
    if (!occupiedLanes[x].has(targetLane - offset)) {
      return targetLane - offset;
    }
    
    // Increase the offset and try again
    offset++;
    
    // Safety check to prevent infinite loops
    if (offset > 100) {
      return targetLane + offset; // Just return something as fallback
    }
  }
}
