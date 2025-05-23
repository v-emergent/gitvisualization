import React from 'react';
import { motion } from 'framer-motion';
import { Handle, Position } from 'reactflow';
import { ShareIcon, StarIcon } from '@heroicons/react/24/outline';

function BranchNode({ data }) {
  const { label, isCurrent } = data;
  
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      transition={{ 
        duration: 0.5, 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }}
      className="relative"
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-lg blur-lg opacity-50 animate-pulse-glow ${
        isCurrent ? 'bg-cyber-pink' : 'bg-cyber-green'
      }`} />
      
      {/* Main Node */}
      <div className={`relative backdrop-blur-sm border-2 rounded-lg px-4 py-3 min-w-[140px] ${
        isCurrent 
          ? 'bg-cyber-pink/20 border-cyber-pink' 
          : 'bg-cyber-green/20 border-cyber-green'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <ShareIcon className={`h-5 w-5 ${
              isCurrent ? 'text-cyber-pink' : 'text-cyber-green'
            }`} />
            {isCurrent && (
              <StarIcon className="h-4 w-4 text-cyber-yellow animate-pulse" />
            )}
          </div>
          <div className={`text-xs font-code px-2 py-0.5 rounded ${
            isCurrent 
              ? 'bg-cyber-pink/30 text-cyber-pink' 
              : 'bg-cyber-green/30 text-cyber-green'
          }`}>
            {isCurrent ? 'ACTIVE' : 'BRANCH'}
          </div>
        </div>
        
        {/* Branch Name */}
        <div className="mb-2">
          <p className={`font-cyber font-bold text-sm ${
            isCurrent ? 'text-cyber-pink' : 'text-cyber-green'
          }`}>
            {label}
          </p>
        </div>
        
        {/* Status */}
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            isCurrent ? 'bg-cyber-pink' : 'bg-cyber-green'
          }`} />
          <span className={`text-xs font-code ${
            isCurrent ? 'text-cyber-pink/80' : 'text-cyber-green/80'
          }`}>
            {isCurrent ? 'HEAD_POINTER' : 'REF_POINTER'}
          </span>
        </div>
        
        {/* Circuit Pattern */}
        <div className="absolute top-0 right-0 w-8 h-8 opacity-20 pointer-events-none">
          <div className={`w-full h-full ${
            isCurrent ? 'text-cyber-pink' : 'text-cyber-green'
          }`}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 4.09L15 3L15.91 5.09L18 4L18.91 6.09L21 5L20.09 7.09L22 8L20.09 9.91L21 12L18.91 10.09L18 12L15.91 10.09L15 12L13.09 10.09L12 12L10.91 10.09L9 12L7.09 10.09L6 12L4.09 10.09L3 12L5.09 9.91L4 8L6.09 7.09L5 5L7.09 6.09L8 4L10.09 5.09L12 2Z"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3 h-3 border-2 bg-cyber-dark ${
          isCurrent ? 'border-cyber-pink' : 'border-cyber-green'
        }`}
      />
    </motion.div>
  );
}

export default BranchNode;