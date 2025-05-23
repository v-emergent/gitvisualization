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
      
      // Add edge from Working Directory to Index with cyberpunk style
      edges.push({
        id: 'working-to-index',
        source: 'working-directory',
        sourceHandle: 'working-to-index',
        target: 'index',
        targetHandle: 'working-to-index',
        animated: true,
        style: { 
          stroke: '#00ffff', 
          strokeWidth: 3,
          filter: 'drop-shadow(0 0 6px #00ffff)'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#00ffff',
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
      
      // Create edges for parent-child relationships with neon glow
      if (commit.parents && commit.parents.length > 0) {
        commit.parents.forEach(parentId => {
          edges.push({
            id: `${id}-${generateNodeId('commit', parentId)}`,
            source: generateNodeId('commit', parentId),
            target: id,
            animated: true,
            style: { 
              stroke: '#00ff41', 
              strokeWidth: 3,
              filter: 'drop-shadow(0 0 6px #00ff41)'
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#00ff41',
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
            stroke: '#ffff00',
            strokeWidth: 3,
            strokeDasharray: '5,5',
            filter: 'drop-shadow(0 0 6px #ffff00)'
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: '#ffff00',
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
            stroke: '#ff0080', 
            strokeWidth: 3,
            strokeDasharray: '10,5',
            filter: 'drop-shadow(0 0 6px #ff0080)'
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: '#ff0080',
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
            stroke: '#8000ff', 
            strokeWidth: 4,
            filter: 'drop-shadow(0 0 8px #8000ff)'
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 24,
            height: 24,
            color: '#8000ff',
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
  
  // Default viewport settings
  const defaultViewport = { x: 0, y: 0, zoom: 0.8 };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="cyber-panel h-full relative overflow-hidden"
    >
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <div className="cyber-panel bg-cyber-dark/90 backdrop-blur-sm px-4 py-2">
          <h3 className="font-cyber text-cyber-cyan text-lg font-bold">
            &gt; NEURAL_REPOSITORY.MAP
          </h3>
          <p className="text-xs text-cyber-cyan/60 font-code">
            VISUALIZING GIT_STRUCTURE.DAT
          </p>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="absolute top-4 right-4 z-10">
        <div className="cyber-panel bg-cyber-dark/90 backdrop-blur-sm px-4 py-2">
          <div className="flex space-x-4 text-xs font-code">
            <span className="text-cyber-green">
              COMMITS: {Object.keys(repository.commits).length}
            </span>
            <span className="text-cyber-pink">
              BRANCHES: {Object.keys(repository.branches).length}
            </span>
            <span className="text-cyber-yellow">
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
        style={{ background: '#1a1a2e' }}
      >
        <Background 
          color="#00ffff" 
          gap={20} 
          size={1} 
          style={{ opacity: 0.3 }}
        />
        <Controls 
          showInteractive={false}
          style={{
            button: {
              backgroundColor: '#1a1a2e',
              border: '1px solid #00ffff',
              color: '#00ffff'
            }
          }}
        />
        <MiniMap 
          nodeColor="#00ffff"
          maskColor="rgba(26, 26, 46, 0.8)"
          style={{
            backgroundColor: '#1a1a2e',
            border: '1px solid #00ffff',
            borderRadius: '8px',
          }}
        />
      </ReactFlow>
    </motion.div>
  );
}

export default GitVisualization;