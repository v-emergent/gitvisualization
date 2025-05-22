import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useGitStore } from '../store/gitStore';
import { useThemeStore } from '../store/themeStore';
import CommitNode from './nodes/CommitNode';
import BranchNode from './nodes/BranchNode';
import HeadNode from './nodes/HeadNode';

// Node types for custom rendering
const nodeTypes = {
  commit: CommitNode,
  branch: BranchNode,
  head: HeadNode,
};

function GitVisualization() {
  const { repository } = useGitStore();
  const { theme } = useThemeStore();
  
  // Generate nodes and edges from repository state
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes = [];
    const edges = [];
    
    // Helper to generate a unique node ID
    const generateNodeId = (type, id) => `${type}-${id}`;
    
    // Create nodes for each commit
    Object.values(repository.commits).forEach((commit) => {
      const id = generateNodeId('commit', commit.id);
      nodes.push({
        id,
        type: 'commit',
        position: { x: commit.x || 0, y: commit.y || 0 },
        data: { 
          label: commit.message,
          id: commit.id.substring(0, 7),
          author: commit.author,
          timestamp: commit.timestamp,
          color: commit.color
        },
      });
      
      // Create edges for parent-child relationships
      if (commit.parents && commit.parents.length > 0) {
        commit.parents.forEach(parentId => {
          edges.push({
            id: `${id}-${generateNodeId('commit', parentId)}`,
            source: generateNodeId('commit', parentId),
            target: id,
            animated: false,
            style: { stroke: theme === 'dark' ? '#9ca3af' : '#4b5563', strokeWidth: 2 },
          });
        });
      }
    });
    
    // Create nodes for each branch
    Object.entries(repository.branches).forEach(([branchName, commitId], index) => {
      const id = generateNodeId('branch', branchName);
      const targetCommitId = generateNodeId('commit', commitId);
      
      // Get branch position from layout algorithm, or calculate if not available
      let position;
      if (repository.branchPositions && repository.branchPositions[branchName]) {
        position = repository.branchPositions[branchName];
      } else {
        // Fallback to old calculation method
        const targetCommit = repository.commits[commitId];
        const xOffset = 100;
        const yOffset = -50 + (index * 40);
        
        if (targetCommit) {
          position = { 
            x: (targetCommit.x || 0) + xOffset, 
            y: (targetCommit.y || 0) + yOffset 
          };
        }
      }
      
      if (position) {
        nodes.push({
          id,
          type: 'branch',
          position: { x: position.x, y: position.y },
          data: { label: branchName, isCurrent: branchName === repository.currentBranch },
        });
        
        edges.push({
          id: `${id}-${targetCommitId}`,
          source: id,
          target: targetCommitId,
          animated: false,
          style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5,5' },
        });
      }
    });
    
    // Create a node for HEAD
    if (repository.HEAD) {
      const id = 'head';
      const targetId = repository.HEAD.type === 'branch' 
        ? generateNodeId('branch', repository.HEAD.reference)
        : generateNodeId('commit', repository.HEAD.reference);
      
      // Get HEAD position from layout algorithm, or calculate if not available
      let position;
      if (repository.headPosition) {
        position = repository.headPosition;
      } else {
        // Find the target node to position relative to it
        const targetNode = nodes.find(node => node.id === targetId);
        
        if (targetNode) {
          position = { 
            x: targetNode.position.x - 80, 
            y: targetNode.position.y - 30 
          };
        }
      }
      
      if (position) {
        nodes.push({
          id,
          type: 'head',
          position: { x: position.x, y: position.y },
          data: { 
            label: 'HEAD', 
            detached: repository.HEAD.type === 'commit',
            reference: repository.HEAD.reference,
          },
        });
        
        edges.push({
          id: `${id}-${targetId}`,
          source: id,
          target: targetId,
          animated: true,
          style: { stroke: '#ef4444', strokeWidth: 2 },
        });
      }
    }
    
    return { initialNodes: nodes, initialEdges: edges };
  }, [repository, theme]);
  
  // Set up nodes and edges state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Update nodes and edges when repository changes
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);
  
  const onLayout = useCallback(() => {
    // No automatic layout for now as we use predefined positions
  }, []);
  
  return (
    <div className={`border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} rounded-lg overflow-hidden h-[70vh]`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color={theme === 'dark' ? '#4b5563' : '#d1d5db'} gap={16} />
        <Controls />
        <MiniMap 
          nodeColor={theme === 'dark' ? '#d1d5db' : '#4b5563'}
          maskColor={theme === 'dark' ? 'rgba(17, 24, 39, 0.7)' : 'rgba(243, 244, 246, 0.7)'}
        />
      </ReactFlow>
    </div>
  );
}

export default GitVisualization;
