import React from 'react';
import { motion } from 'framer-motion';
import { Handle, Position } from 'reactflow';
import { 
  ArchiveBoxIcon, 
  DocumentIcon,
  CheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

function IndexNode({ data }) {
  const { files = [] } = data;
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: -20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-lg blur-lg opacity-40 animate-pulse-glow bg-cyber-cyan" />
      
      {/* Main Node */}
      <div className="relative bg-cyber-cyan/20 backdrop-blur-sm border-2 border-cyber-cyan rounded-lg p-4 min-w-[200px] max-w-[280px]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ 
                rotateY: [0, 180, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <ArchiveBoxIcon className="h-6 w-6 text-cyber-cyan" />
            </motion.div>
            <span className="font-cyber text-cyber-cyan font-bold text-sm">
              STAGING_AREA
            </span>
          </div>
          <div className="text-xs font-code bg-cyber-cyan/30 text-cyber-cyan px-2 py-0.5 rounded">
            {files.length} STAGED
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-3">
          <p className="text-xs font-code text-cyber-cyan/80">
            Ready for commit operations
          </p>
        </div>
        
        {/* Files List */}
        {files.length > 0 ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="space-y-2 max-h-32 overflow-y-auto"
          >
            {files.map((file, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center space-x-2 p-1 bg-cyber-dark/30 rounded text-xs font-code"
              >
                <CheckIcon className="h-3 w-3 text-cyber-green" />
                <span className="text-cyber-cyan">
                  {file.name}
                </span>
                <span className="text-cyber-green/70 ml-auto">
                  staged
                </span>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-4">
            <ArchiveBoxIcon className="h-8 w-8 text-cyber-cyan/40 mx-auto mb-2" />
            <p className="text-xs font-code text-cyber-cyan/60">
              No files staged
            </p>
            <p className="text-xs font-code text-cyber-cyan/40 mt-1">
              Use 'git add' to stage changes
            </p>
          </div>
        )}
        
        {/* Status Indicator */}
        <div className="mt-3 pt-2 border-t border-cyber-cyan/20">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ 
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-cyber-cyan rounded-full"
            />
            <span className="text-xs font-code text-cyber-cyan/80">
              {files.length > 0 ? 'COMMIT_READY' : 'AWAITING_CHANGES'}
            </span>
          </div>
        </div>
        
        {/* Holographic Effect */}
        <div className="absolute inset-0 opacity-5 pointer-events-none rounded-lg overflow-hidden">
          <motion.div
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-gradient-to-br from-cyber-cyan via-transparent to-cyber-cyan"
            style={{
              backgroundSize: '200% 200%'
            }}
          />
        </div>
        
        {/* Data Stream Visualization */}
        <div className="absolute top-0 right-0 w-8 h-8 opacity-20 pointer-events-none overflow-hidden rounded-tr-lg">
          <motion.div
            animate={{ 
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full text-cyber-cyan"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3V21H5V19H7V17H5V15H7V13H5V11H7V9H5V7H7V5H5V3H3ZM9 5V7H11V9H9V11H11V13H9V15H11V17H9V19H11V21H13V19H15V17H13V15H15V13H13V11H15V9H13V7H15V5H13V3H11V5H9ZM17 7V9H19V11H17V13H19V15H17V17H19V19H21V17H19V15H21V13H19V11H21V9H19V7H17Z"/>
            </svg>
          </motion.div>
        </div>
      </div>
      
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="working-to-index"
        className="w-3 h-3 border-2 border-cyber-cyan bg-cyber-dark"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="index-to-commit"
        className="w-3 h-3 border-2 border-cyber-cyan bg-cyber-dark"
      />
    </motion.div>
  );
}

export default IndexNode;