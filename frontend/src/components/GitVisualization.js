import React, { useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    
    // Improved layout positioning
    const LAYOUT = {
      WORKING_DIR: { x: 50, y: 100 },
      INDEX: { x: 300, y: 100 },
      COMMIT_START_X: 550,
      COMMIT_START_Y: 100,
      COMMIT_SPACING_X: 200,
      COMMIT_SPACING_Y: 150,
      BRANCH_OFFSET_X: 120,
      BRANCH_OFFSET_Y: -80,
      HEAD_OFFSET_X: -120,
      HEAD_OFFSET_Y: -80
    };
    
    // Add Working Directory node
    if (repository.initialized) {
      nodes.push({
        id: 'working-directory',
        type: 'workingDir',
        position: LAYOUT.WORKING_DIR,
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
        position: LAYOUT.INDEX,
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
          stroke: '#00d4aa', 
          strokeWidth: 2,
          zIndex: 1000
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: '#00d4aa',
        },
        type: 'smoothstep',
      });
    }
    
    // Create nodes for each commit with better positioning
    const commitEntries = Object.values(repository.commits);
    commitEntries.forEach((commit, index) => {
      const id = generateNodeId('commit', commit.id);
      
      // Calculate position based on commit order
      const row = Math.floor(index / 3); // 3 commits per row
      const col = index % 3;
      
      const position = {
        x: LAYOUT.COMMIT_START_X + (col * LAYOUT.COMMIT_SPACING_X),
        y: LAYOUT.COMMIT_START_Y + (row * LAYOUT.COMMIT_SPACING_Y)
      };
      
      nodes.push({
        id,
        type: 'commit',
        position,
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
              stroke: '#4ade80', 
              strokeWidth: 2,
              zIndex: 1000
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 16,
              height: 16,
              color: '#4ade80',
            },
            type: 'smoothstep',
          });
        });
      } else if (repository.initialized && index === 0) {
        // Connect first commit to the index
        edges.push({
          id: `index-to-${id}`,
          source: 'index',
          sourceHandle: 'index-to-commit',
          target: id,
          animated: false,
          style: { 
            stroke: '#fbbf24',
            strokeWidth: 2,
            strokeDasharray: '5,5',
            zIndex: 1000
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 16,
            height: 16,
            color: '#fbbf24',
          },
          type: 'smoothstep',
        });
      }
    });
    
    // Create nodes for each branch with better positioning
    Object.entries(repository.branches).forEach(([branchName, commitId], index) => {
      const id = generateNodeId('branch', branchName);
      const targetCommitId = generateNodeId('commit', commitId);
      
      // Find the target commit node to position relative to it
      const targetCommit = commitEntries.find(c => c.id === commitId);
      if (targetCommit) {
        const commitIndex = commitEntries.indexOf(targetCommit);
        const row = Math.floor(commitIndex / 3);
        const col = commitIndex % 3;
        
        const position = {
          x: LAYOUT.COMMIT_START_X + (col * LAYOUT.COMMIT_SPACING_X) + LAYOUT.BRANCH_OFFSET_X,
          y: LAYOUT.COMMIT_START_Y + (row * LAYOUT.COMMIT_SPACING_Y) + LAYOUT.BRANCH_OFFSET_Y + (index * 60)
        };
        
        nodes.push({
          id,
          type: 'branch',
          position,
          data: { label: branchName, isCurrent: branchName === repository.currentBranch },
        });
        
        edges.push({
          id: `${id}-${targetCommitId}`,
          source: id,
          target: targetCommitId,
          animated: false,
          style: { 
            stroke: '#f472b6', 
            strokeWidth: 2,
            strokeDasharray: '8,4',
            zIndex: 1000
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 16,
            height: 16,
            color: '#f472b6',
          },
          type: 'smoothstep',
        });
      }
    });
    
    // Create a node for HEAD with better positioning
    if (repository.HEAD) {
      const id = 'head';
      const targetId = repository.HEAD.type === 'branch' 
        ? generateNodeId('branch', repository.HEAD.reference)
        : generateNodeId('commit', repository.HEAD.reference);
      
      // Find the target node to position relative to it
      const targetNode = nodes.find(node => node.id === targetId);
      
      if (targetNode) {
        const position = { 
          x: targetNode.position.x + LAYOUT.HEAD_OFFSET_X, 
          y: targetNode.position.y + LAYOUT.HEAD_OFFSET_Y
        };
        
        nodes.push({
          id,
          type: 'head',
          position,
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
            stroke: '#a855f7', 
            strokeWidth: 3,
            zIndex: 1000
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: '#a855f7',
          },
          type: 'smoothstep',
        });
      }
    }
    
    return { initialNodes: nodes, initialEdges: edges };
  }, [repository]);
  
  // Set up nodes and edges state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Update nodes and edges when repository changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);
  
  // Default viewport settings
  const defaultViewport = { x: 0, y: 0, zoom: 0.8 };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 border border-gray-700 h-full relative overflow-hidden rounded-lg"
    >
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-gray-800 border border-gray-600 rounded px-4 py-2">
          <h3 className="text-white text-lg font-bold">
            Git Repository
          </h3>
          <p className="text-xs text-gray-400">
            Repository visualization
          </p>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-gray-800 border border-gray-600 rounded px-4 py-2">
          <div className="flex space-x-4 text-xs">
            <span className="text-green-400">
              Commits: {Object.keys(repository.commits).length}
            </span>
            <span className="text-blue-400">
              Branches: {Object.keys(repository.branches).length}
            </span>
            <span className="text-yellow-400">
              HEAD: {repository.HEAD?.type || 'NULL'}
            </span>
          </div>
        </div>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
        fitView
        fitViewOptions={{ 
          padding: 0.2,
          includeHiddenNodes: true,
          minZoom: 0.5,
          maxZoom: 1.2
        }}
        attributionPosition="bottom-right"
        panOnScroll
        minZoom={0.3}
        maxZoom={1.5}
        nodesDraggable={true}
        zoomOnDoubleClick={false}
        snapToGrid={true}
        snapGrid={[25, 25]}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
        style={{ 
          background: '#1a1a2e',
          zIndex: 1
        }}
        connectionLineStyle={{ 
          stroke: '#64748b', 
          strokeWidth: 2 
        }}
        edgeStyle={{ 
          zIndex: 1000 
        }}
      >
        <Background 
          color="#374151" 
          gap={25} 
          size={1} 
          style={{ opacity: 0.5 }}
        />
        <Controls 
          showInteractive={false}
          style={{
            button: {
              backgroundColor: '#374151',
              border: '1px solid #6b7280',
              color: '#d1d5db'
            }
          }}
        />
        <MiniMap 
          nodeColor="#6b7280"
          maskColor="rgba(26, 26, 46, 0.8)"
          style={{
            backgroundColor: '#374151',
            border: '1px solid #6b7280',
            borderRadius: '8px',
          }}
        />
      </ReactFlow>
    </motion.div>
  );
}

export default GitVisualization;