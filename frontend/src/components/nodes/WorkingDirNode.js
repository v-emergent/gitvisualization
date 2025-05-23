import React from 'react';
import { motion } from 'framer-motion';
import { Handle, Position } from 'reactflow';
import { 
  FolderIcon, 
  DocumentIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

function WorkingDirNode({ data }) {
  const { files = [] } = data;
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return <PlusIcon className="h-3 w-3 text-cyber-green" />;
      case 'modified':
        return <PencilIcon className="h-3 w-3 text-cyber-yellow" />;
      case 'deleted':
        return <TrashIcon className="h-3 w-3 text-red-400" />;
      default:
        return <DocumentIcon className="h-3 w-3 text-cyber-cyan" />;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'text-cyber-green';
      case 'modified':
        return 'text-cyber-yellow';
      case 'deleted':
        return 'text-red-400';
      default:
        return 'text-cyber-cyan';
    }
  };
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, x: -50 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-lg blur-lg opacity-40 animate-pulse-glow bg-cyber-yellow" />
      
      {/* Main Node */}
      <div className="relative bg-cyber-yellow/20 backdrop-blur-sm border-2 border-cyber-yellow rounded-lg p-4 min-w-[200px] max-w-[280px]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FolderIcon className="h-6 w-6 text-cyber-yellow" />
            </motion.div>
            <span className="font-cyber text-cyber-yellow font-bold text-sm">
              WORKING_DIR
            </span>
          </div>
          <div className="text-xs font-code bg-cyber-yellow/30 text-cyber-yellow px-2 py-0.5 rounded">
            {files.length} ITEM{files.length !== 1 ? 'S' : ''}
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-3">
          <p className="text-xs font-code text-cyber-yellow/80">
            Local filesystem changes
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
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center space-x-2 p-1 bg-cyber-dark/30 rounded text-xs font-code"
              >
                {getStatusIcon(file.status)}
                <span className={getStatusColor(file.status)}>
                  {file.name}
                </span>
                <span className="text-cyber-cyan/50 ml-auto">
                  {file.status}
                </span>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-4">
            <DocumentIcon className="h-8 w-8 text-cyber-yellow/40 mx-auto mb-2" />
            <p className="text-xs font-code text-cyber-yellow/60">
              No changes detected
            </p>
          </div>
        )}
        
        {/* Status Indicator */}
        <div className="mt-3 pt-2 border-t border-cyber-yellow/20">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-cyber-yellow rounded-full"
            />
            <span className="text-xs font-code text-cyber-yellow/80">
              {files.length > 0 ? 'CHANGES_DETECTED' : 'CLEAN_STATE'}
            </span>
          </div>
        </div>
        
        {/* Circuit Pattern */}
        <div className="absolute top-0 right-0 w-12 h-12 opacity-10 pointer-events-none overflow-hidden rounded-tr-lg">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-full h-full text-cyber-yellow"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 2V8H7V10H9V14H7V16H9V22H11V16H13V14H11V10H13V8H11V2H9ZM15 6V8H17V14H15V16H17V18H19V16H21V14H19V8H21V6H19V4H17V6H15Z"/>
            </svg>
          </motion.div>
        </div>
      </div>
      
      {/* Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="working-to-index"
        className="w-3 h-3 border-2 border-cyber-yellow bg-cyber-dark"
      />
    </motion.div>
  );
}

export default WorkingDirNode;