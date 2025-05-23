import { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useGitStore } from '../store/gitStore';
import { useThemeStore } from '../store/themeStore';
import CommitNode from './nodes/CommitNode';
import BranchNode from './nodes/BranchNode';
import HeadNode from './nodes/HeadNode';
import WorkingDirNode from './nodes/WorkingDirNode';
import IndexNode from './nodes/IndexNode';

// Node types for custom rendering
const nodeTypes = {
  commit: CommitNode,
  branch: BranchNode,
  head: HeadNode,
  workingDir: WorkingDirNode,
  index: IndexNode,
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
    
    // Add Working Directory node
    if (repository.initialized) {
      nodes.push({
        id: 'working-directory',
        type: 'workingDir',
        position: repository.workingDirPosition || { x: 200, y: 50 },
        data: { 
          files: repository.workingDirectory ? 
            Object.entries(repository.workingDirectory).map(([name, status]) => ({ name, status })) : 
            []
        },
      });
      
      // Add Index/Staging Area node
      nodes.push({
        id: 'index',
        type: 'index',
        position: repository.indexPosition || { x: 450, y: 50 },
        data: { 
          files: repository.index ? 
            Object.entries(repository.index).map(([name, status]) => ({ name, status })) : 
            []
        },
      });
      
      // Add edge from Working Directory to Index
      edges.push({
        id: 'working-to-index',
        source: 'working-directory',
        sourceHandle: 'working-to-index',
        target: 'index',
        targetHandle: 'working-to-index',
        animated: true,
        style: { 
          stroke: theme === 'dark' ? '#60a5fa' : '#3b82f6', 
          strokeWidth: 3 
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: theme === 'dark' ? '#60a5fa' : '#3b82f6',
        },
        type: 'smoothstep',
      });
    }
    
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
          color: commit.color,
          files: commit.files || []
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
            style: { 
              stroke: theme === 'dark' ? '#9ca3af' : '#4b5563', 
              strokeWidth: 3 
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: theme === 'dark' ? '#9ca3af' : '#4b5563',
            },
            type: 'smoothstep',
          });
        });
      } else if (repository.initialized) {
        // Connect initial commit to the index
        edges.push({
          id: `index-to-${id}`,
          source: 'index',
          sourceHandle: 'index-to-commit',
          target: id,
          animated: false,
          style: { 
            stroke: theme === 'dark' ? '#10b981' : '#059669',
            strokeWidth: 3,
            strokeDasharray: '5,5' 
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: theme === 'dark' ? '#10b981' : '#059669',
          },
          type: 'smoothstep',
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
        const xOffset = 120;
        const yOffset = -60 + (index * 50);
        
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
          style: { 
            stroke: '#10b981', 
            strokeWidth: 3,
            strokeDasharray: '10,5' 
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: '#10b981',
          },
          type: 'smoothstep',
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
            x: targetNode.position.x - 100, 
            y: targetNode.position.y - 50 
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
          style: { 
            stroke: '#ef4444', 
            strokeWidth: 3 
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: '#ef4444',
          },
          type: 'smoothstep',
        });
      }
    }
    
    return { initialNodes: nodes, initialEdges: edges };
  }, [repository, theme]);
  
  // Set up nodes and edges state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Update nodes and edges when repository changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);
  
  // Define edge types for different edge styles
  const edgeTypes = {
    default: 'smoothstep',
  };
  
  // Default viewport settings
  const defaultViewport = { x: 0, y: 0, zoom: 0.8 };
  
  return (
    <div className={`border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} rounded-lg overflow-hidden h-[70vh]`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={defaultViewport}
        fitView
        fitViewOptions={{ 
          padding: 0.3,
          includeHiddenNodes: true,
          minZoom: 0.4,
          maxZoom: 1.5
        }}
        attributionPosition="bottom-right"
        panOnScroll
        minZoom={0.2}
        maxZoom={2}
        nodesDraggable={false}
        zoomOnDoubleClick={false}
        snapToGrid={true}
        snapGrid={[20, 20]}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background color={theme === 'dark' ? '#4b5563' : '#d1d5db'} gap={20} size={1} />
        <Controls showInteractive={false} />
        <MiniMap 
          nodeColor={theme === 'dark' ? '#d1d5db' : '#4b5563'}
          maskColor={theme === 'dark' ? 'rgba(17, 24, 39, 0.7)' : 'rgba(243, 244, 246, 0.7)'}
          style={{
            borderRadius: '0.5rem',
            border: theme === 'dark' ? '1px solid #4b5563' : '1px solid #d1d5db',
          }}
        />
      </ReactFlow>
    </div>
  );
}

export default GitVisualization;
