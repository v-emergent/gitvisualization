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
      {/* Main Node */}
      <div className={`bg-gray-800 border rounded-lg px-3 py-2 min-w-[120px] ${
        isCurrent 
          ? 'border-blue-400' 
          : 'border-gray-600'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <ShareIcon className={`h-4 w-4 ${
              isCurrent ? 'text-blue-400' : 'text-gray-400'
            }`} />
            {isCurrent && (
              <StarIcon className="h-3 w-3 text-yellow-400" />
            )}
          </div>
          <div className={`text-xs px-2 py-0.5 rounded ${
            isCurrent 
              ? 'bg-blue-900 text-blue-300' 
              : 'bg-gray-700 text-gray-300'
          }`}>
            {isCurrent ? 'CURRENT' : 'BRANCH'}
          </div>
        </div>
        
        {/* Branch Name */}
        <div className="mb-1">
          <p className={`font-bold text-sm ${
            isCurrent ? 'text-blue-300' : 'text-gray-300'
          }`}>
            {label}
          </p>
        </div>
        
        {/* Status */}
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isCurrent ? 'bg-blue-400' : 'bg-gray-500'
          }`} />
          <span className={`text-xs ${
            isCurrent ? 'text-blue-400' : 'text-gray-400'
          }`}>
            {isCurrent ? 'Active' : 'Branch'}
          </span>
        </div>
      </div>
      
      {/* Handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-2 h-2 border bg-gray-700 ${
          isCurrent ? 'border-blue-400' : 'border-gray-500'
        }`}
      />
    </motion.div>
  );
}

export default BranchNode;