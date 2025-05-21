import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// Helper function to generate random colors for commits
const getRandomColor = () => {
  const colors = [
    '#10b981', // emerald
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#f59e0b', // amber
    '#06b6d4', // cyan
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Helper to parse git commands
const parseGitCommand = (commandStr) => {
  const parts = commandStr.trim().split(' ');
  
  if (parts[0].toLowerCase() !== 'git') {
    return { error: true, message: 'Command must start with "git"' };
  }
  
  const command = parts[1]?.toLowerCase();
  const args = parts.slice(2);
  
  return { command, args };
};

// Initial repository state
const initialRepositoryState = {
  initialized: false,
  commits: {},
  branches: {},
  HEAD: null,
  currentBranch: null,
  index: {}, // Staged files
  workingDirectory: {}, // Modified files
};

// Git store with command handling logic
export const useGitStore = create(
  persist(
    (set, get) => ({
      repository: { ...initialRepositoryState },
      commandHistory: [],
      lastCommandOutput: [],
      initialized: false,
      
      // Initialize a new repository
      initializeRepository: () => {
        const newRepository = { ...initialRepositoryState };
        
        // Initialize repository similar to git init
        const x = 300;
        const y = 200;
        
        // Create initial commit
        const commitId = uuidv4();
        
        // Set up initial repository state
        newRepository.initialized = true;
        newRepository.commits = {
          [commitId]: {
            id: commitId,
            message: 'Initial commit',
            parents: [],
            author: 'User',
            timestamp: Date.now(),
            color: getRandomColor(),
            x,
            y
          }
        };
        newRepository.branches = {
          'main': commitId
        };
        newRepository.HEAD = {
          type: 'branch',
          reference: 'main'
        };
        newRepository.currentBranch = 'main';
        
        set({
          repository: newRepository,
          commandHistory: ['git init'],
          lastCommandOutput: [
            { 
              command: 'git init', 
              message: 'Initialized empty Git repository',
              error: false
            }
          ],
          initialized: true,
        });
      },
      
      // Reset the repository to initial state
      resetRepository: () => {
        set({
          repository: { ...initialRepositoryState },
          commandHistory: [],
          lastCommandOutput: [],
          initialized: false,
        });
      },
      
      // Execute a git command
      executeCommand: (commandStr) => {
        const state = get();
        const { repository, commandHistory } = state;
        
        // Add command to history
        const updatedHistory = [...commandHistory, commandStr];
        
        // Parse the command
        const { command, args, error, message } = parseGitCommand(commandStr);
        
        if (error) {
          set((state) => ({
            commandHistory: updatedHistory,
            lastCommandOutput: [
              ...state.lastCommandOutput,
              { command: commandStr, message, error: true }
            ]
          }));
          return;
        }
        
        // Process the command
        let result = { success: false, message: 'Unknown command', error: true };
        let updatedRepository = { ...repository };
        
        switch (command) {
          case 'init':
            result = handleGitInit(updatedRepository);
            break;
          case 'commit':
            result = handleGitCommit(updatedRepository, args);
            break;
          case 'branch':
            result = handleGitBranch(updatedRepository, args);
            break;
          case 'checkout':
            result = handleGitCheckout(updatedRepository, args);
            break;
          case 'merge':
            result = handleGitMerge(updatedRepository, args);
            break;
          case 'add':
            result = handleGitAdd(updatedRepository, args);
            break;
          case 'status':
            result = handleGitStatus(updatedRepository);
            break;
          case 'log':
            result = handleGitLog(updatedRepository, args);
            break;
          case 'reset':
            result = handleGitReset(updatedRepository, args);
            break;
          case 'revert':
            result = handleGitRevert(updatedRepository, args);
            break;
          default:
            result = { 
              success: false, 
              message: `Git command not supported: "${command}"`, 
              error: true 
            };
        }
        
        // Update state with results
        set((state) => ({
          repository: result.success ? updatedRepository : state.repository,
          commandHistory: updatedHistory,
          lastCommandOutput: [
            ...state.lastCommandOutput,
            { 
              command: commandStr, 
              message: result.message,
              error: !result.success
            }
          ]
        }));
      }
    }),
    {
      name: 'git-visualization-storage',
    }
  )
);

// Command handlers

// Initialize a new Git repository
function handleGitInit(repository) {
  if (repository.initialized) {
    return { 
      success: false, 
      message: 'Git repository already initialized',
      error: true
    };
  }
  
  // Default branch position
  const x = 300;
  const y = 200;
  
  // Create initial commit
  const commitId = uuidv4();
  
  // Set up initial repository state
  repository.initialized = true;
  repository.commits = {
    [commitId]: {
      id: commitId,
      message: 'Initial commit',
      parents: [],
      author: 'User',
      timestamp: Date.now(),
      color: getRandomColor(),
      x,
      y
    }
  };
  repository.branches = {
    'main': commitId
  };
  repository.HEAD = {
    type: 'branch',
    reference: 'main'
  };
  repository.currentBranch = 'main';
  
  return { 
    success: true, 
    message: 'Initialized empty Git repository'
  };
}

// Create a new commit
function handleGitCommit(repository, args) {
  if (!repository.initialized) {
    return { 
      success: false, 
      message: 'Not a git repository (or any of the parent directories)',
      error: true
    };
  }
  
  // Parse commit message
  let message = 'Empty commit message';
  if (args.includes('-m')) {
    const messageIndex = args.indexOf('-m') + 1;
    if (messageIndex < args.length) {
      message = args[messageIndex].replace(/"/g, '');
    }
  }
  
  // Get current HEAD
  const head = repository.HEAD;
  if (!head) {
    return { 
      success: false, 
      message: 'HEAD is not set',
      error: true
    };
  }
  
  // Get parent commit
  let parentCommitId;
  if (head.type === 'branch') {
    parentCommitId = repository.branches[head.reference];
  } else {
    parentCommitId = head.reference;
  }
  
  if (!parentCommitId || !repository.commits[parentCommitId]) {
    return { 
      success: false, 
      message: 'Cannot find parent commit',
      error: true
    };
  }
  
  // Calculate position for new commit based on parent
  const parentCommit = repository.commits[parentCommitId];
  const x = parentCommit.x + 150;
  const y = parentCommit.y;
  
  // Create new commit
  const commitId = uuidv4();
  repository.commits[commitId] = {
    id: commitId,
    message,
    parents: [parentCommitId],
    author: 'User',
    timestamp: Date.now(),
    color: getRandomColor(),
    x,
    y
  };
  
  // Update branch if HEAD points to a branch
  if (head.type === 'branch') {
    repository.branches[head.reference] = commitId;
  } else {
    // Update HEAD to point to the new commit in detached state
    repository.HEAD = {
      type: 'commit',
      reference: commitId
    };
  }
  
  return { 
    success: true, 
    message: `[${commitId.substring(0, 7)}] ${message}`
  };
}

// Create a new branch
function handleGitBranch(repository, args) {
  if (!repository.initialized) {
    return { 
      success: false, 
      message: 'Not a git repository',
      error: true
    };
  }
  
  // If no args, list branches
  if (args.length === 0) {
    const branches = Object.keys(repository.branches);
    const currentBranch = repository.currentBranch;
    
    const branchList = branches.map(branch => 
      branch === currentBranch ? `* ${branch}` : `  ${branch}`
    ).join('\n');
    
    return { 
      success: true, 
      message: branchList || 'No branches found'
    };
  }
  
  // Create a new branch
  const branchName = args[0];
  
  // Check if branch already exists
  if (repository.branches[branchName]) {
    return { 
      success: false, 
      message: `Branch '${branchName}' already exists`,
      error: true
    };
  }
  
  // Get current commit
  let currentCommitId;
  if (repository.HEAD.type === 'branch') {
    currentCommitId = repository.branches[repository.HEAD.reference];
  } else {
    currentCommitId = repository.HEAD.reference;
  }
  
  // Create branch pointing to current commit
  repository.branches[branchName] = currentCommitId;
  
  return { 
    success: true, 
    message: `Created branch '${branchName}'`
  };
}

// Switch branches or restore working tree files
function handleGitCheckout(repository, args) {
  if (!repository.initialized) {
    return { 
      success: false, 
      message: 'Not a git repository',
      error: true
    };
  }
  
  if (args.length === 0) {
    return { 
      success: false, 
      message: 'You must specify a branch name or commit hash',
      error: true
    };
  }
  
  // Check if creating a new branch with -b flag
  if (args[0] === '-b' && args.length > 1) {
    const branchName = args[1];
    
    // First create the branch
    const createResult = handleGitBranch(repository, [branchName]);
    if (!createResult.success) {
      return createResult;
    }
    
    // Then checkout the new branch
    return handleGitCheckout(repository, [branchName]);
  }
  
  const target = args[0];
  
  // Check if target is a branch
  if (repository.branches[target]) {
    repository.HEAD = {
      type: 'branch',
      reference: target
    };
    repository.currentBranch = target;
    
    return { 
      success: true, 
      message: `Switched to branch '${target}'`
    };
  }
  
  // Check if target is a commit
  if (repository.commits[target] || Object.values(repository.commits).some(c => c.id.startsWith(target))) {
    // Find the commit if partial hash was provided
    const commitId = repository.commits[target] 
      ? target 
      : Object.values(repository.commits).find(c => c.id.startsWith(target))?.id;
    
    if (commitId) {
      repository.HEAD = {
        type: 'commit',
        reference: commitId
      };
      repository.currentBranch = null;
      
      return { 
        success: true, 
        message: `Note: checking out '${commitId.substring(0, 7)}'.\nYou are in 'detached HEAD' state.`
      };
    }
  }
  
  return { 
    success: false, 
    message: `Error: pathspec '${target}' did not match any file(s) known to git`,
    error: true
  };
}

// Join two or more development histories together
function handleGitMerge(repository, args) {
  if (!repository.initialized) {
    return { 
      success: false, 
      message: 'Not a git repository',
      error: true
    };
  }
  
  if (args.length === 0) {
    return { 
      success: false, 
      message: 'You must specify a branch to merge',
      error: true
    };
  }
  
  const sourceBranchName = args[0];
  
  // Check if source branch exists
  if (!repository.branches[sourceBranchName]) {
    return { 
      success: false, 
      message: `Branch '${sourceBranchName}' not found`,
      error: true
    };
  }
  
  // Cannot merge if HEAD is detached
  if (repository.HEAD.type !== 'branch') {
    return { 
      success: false, 
      message: 'Cannot merge in detached HEAD state',
      error: true
    };
  }
  
  const targetBranchName = repository.HEAD.reference;
  
  // Get the commit IDs
  const sourceCommitId = repository.branches[sourceBranchName];
  const targetCommitId = repository.branches[targetBranchName];
  
  // Don't merge if already up-to-date
  if (sourceCommitId === targetCommitId) {
    return { 
      success: true, 
      message: 'Already up to date.'
    };
  }
  
  // Calculate position for merge commit
  const sourceCommit = repository.commits[sourceCommitId];
  const targetCommit = repository.commits[targetCommitId];
  
  const x = Math.max(sourceCommit.x, targetCommit.x) + 150;
  const y = (sourceCommit.y + targetCommit.y) / 2;
  
  // Create merge commit
  const commitId = uuidv4();
  repository.commits[commitId] = {
    id: commitId,
    message: `Merge branch '${sourceBranchName}' into ${targetBranchName}`,
    parents: [targetCommitId, sourceCommitId],
    author: 'User',
    timestamp: Date.now(),
    color: getRandomColor(),
    x,
    y
  };
  
  // Update target branch to point to merge commit
  repository.branches[targetBranchName] = commitId;
  
  return { 
    success: true, 
    message: `Merged branch '${sourceBranchName}' into ${targetBranchName}`
  };
}

// Add file contents to the index
function handleGitAdd(repository, args) {
  // Simplified implementation
  return { 
    success: true, 
    message: 'Changes staged for commit'
  };
}

// Show the working tree status
function handleGitStatus(repository) {
  if (!repository.initialized) {
    return { 
      success: false, 
      message: 'Not a git repository',
      error: true
    };
  }
  
  let output = '';
  
  // Branch info
  if (repository.HEAD.type === 'branch') {
    output += `On branch ${repository.HEAD.reference}\n`;
  } else {
    output += `HEAD detached at ${repository.HEAD.reference.substring(0, 7)}\n`;
  }
  
  // Simplified status
  output += 'No changes to commit\n';
  
  return { 
    success: true, 
    message: output
  };
}

// Show commit logs
function handleGitLog(repository, args) {
  if (!repository.initialized) {
    return { 
      success: false, 
      message: 'Not a git repository',
      error: true
    };
  }
  
  // Get current commit
  let currentCommitId;
  if (repository.HEAD.type === 'branch') {
    currentCommitId = repository.branches[repository.HEAD.reference];
  } else {
    currentCommitId = repository.HEAD.reference;
  }
  
  if (!currentCommitId) {
    return { 
      success: true, 
      message: 'No commits yet'
    };
  }
  
  // Collect commits by traversing history
  const processedCommits = new Set();
  let output = '';
  
  function traverseCommits(commitId) {
    if (processedCommits.has(commitId) || !repository.commits[commitId]) {
      return;
    }
    
    processedCommits.add(commitId);
    const commit = repository.commits[commitId];
    
    output += `commit ${commit.id}\n`;
    output += `Author: ${commit.author}\n`;
    output += `Date:   ${new Date(commit.timestamp).toISOString()}\n\n`;
    output += `    ${commit.message}\n\n`;
    
    if (commit.parents && commit.parents.length > 0) {
      commit.parents.forEach(parentId => traverseCommits(parentId));
    }
  }
  
  traverseCommits(currentCommitId);
  
  return { 
    success: true, 
    message: output || 'No commit history'
  };
}

// Reset current HEAD to specified state
function handleGitReset(repository, args) {
  if (!repository.initialized) {
    return { 
      success: false, 
      message: 'Not a git repository',
      error: true
    };
  }
  
  if (args.length === 0) {
    return { 
      success: false, 
      message: 'You must specify a commit or reference',
      error: true
    };
  }
  
  // Parse mode (--soft, --mixed, --hard)
  let mode = 'mixed'; // Default mode
  if (args.includes('--soft')) {
    mode = 'soft';
  } else if (args.includes('--hard')) {
    mode = 'hard';
  } else if (args.includes('--mixed')) {
    mode = 'mixed';
  }
  
  // Get target commit
  const targetArg = args.find(arg => !arg.startsWith('--'));
  if (!targetArg) {
    return { 
      success: false, 
      message: 'You must specify a commit or reference',
      error: true
    };
  }
  
  // Check if HEAD is detached
  if (repository.HEAD.type !== 'branch') {
    return { 
      success: false, 
      message: 'Cannot reset in detached HEAD state. Checkout a branch first.',
      error: true
    };
  }
  
  // Handle common relative references
  let targetCommitId;
  if (targetArg === 'HEAD~1' || targetArg === 'HEAD~') {
    // Get parent of current HEAD
    const currentCommitId = repository.branches[repository.HEAD.reference];
    const currentCommit = repository.commits[currentCommitId];
    
    if (!currentCommit || !currentCommit.parents || currentCommit.parents.length === 0) {
      return { 
        success: false, 
        message: 'Cannot reset: HEAD has no parent',
        error: true
      };
    }
    
    targetCommitId = currentCommit.parents[0];
  } else {
    // Try to find the commit by id or short id
    const commit = repository.commits[targetArg] || 
                  Object.values(repository.commits).find(c => c.id.startsWith(targetArg));
    
    if (!commit) {
      return { 
        success: false, 
        message: `Cannot find commit '${targetArg}'`,
        error: true
      };
    }
    
    targetCommitId = commit.id;
  }
  
  // Update branch pointer
  const branchName = repository.HEAD.reference;
  repository.branches[branchName] = targetCommitId;
  
  // Different behaviors based on reset mode
  let modeMessage;
  switch (mode) {
    case 'soft':
      modeMessage = 'with --soft: only HEAD was changed';
      break;
    case 'hard':
      modeMessage = 'with --hard: HEAD, index and working directory were changed';
      break;
    default: // mixed
      modeMessage = 'with --mixed (default): HEAD and index were changed';
  }
  
  return { 
    success: true, 
    message: `Reset to ${targetCommitId.substring(0, 7)} ${modeMessage}`
  };
}

// Revert some existing commits
function handleGitRevert(repository, args) {
  if (!repository.initialized) {
    return { 
      success: false, 
      message: 'Not a git repository',
      error: true
    };
  }
  
  if (args.length === 0) {
    return { 
      success: false, 
      message: 'You must specify a commit to revert',
      error: true
    };
  }
  
  // Get commit to revert
  const targetArg = args[0];
  const commit = repository.commits[targetArg] || 
                Object.values(repository.commits).find(c => c.id.startsWith(targetArg));
  
  if (!commit) {
    return { 
      success: false, 
      message: `Cannot find commit '${targetArg}'`,
      error: true
    };
  }
  
  // Get current HEAD commit
  let currentCommitId;
  if (repository.HEAD.type === 'branch') {
    currentCommitId = repository.branches[repository.HEAD.reference];
  } else {
    currentCommitId = repository.HEAD.reference;
  }
  
  if (!currentCommitId) {
    return { 
      success: false, 
      message: 'HEAD not set',
      error: true
    };
  }
  
  const currentCommit = repository.commits[currentCommitId];
  
  // Create revert commit
  const newCommitId = uuidv4();
  repository.commits[newCommitId] = {
    id: newCommitId,
    message: `Revert "${commit.message}"`,
    parents: [currentCommitId],
    author: 'User',
    timestamp: Date.now(),
    color: getRandomColor(),
    x: currentCommit.x + 150,
    y: currentCommit.y
  };
  
  // Update branch if HEAD points to a branch
  if (repository.HEAD.type === 'branch') {
    repository.branches[repository.HEAD.reference] = newCommitId;
  } else {
    // Update HEAD to point to the new commit in detached state
    repository.HEAD = {
      type: 'commit',
      reference: newCommitId
    };
  }
  
  return { 
    success: true, 
    message: `Created revert commit: ${newCommitId.substring(0, 7)}\nReverted commit ${commit.id.substring(0, 7)}: ${commit.message}`
  };
}
