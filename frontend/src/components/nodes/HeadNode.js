import React from 'react';
import { motion } from 'framer-motion';
import { Handle, Position } from 'reactflow';
import { 
  CursorArrowRaysIcon, 
  ExclamationTriangleIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

function HeadNode({ data }) {
  const { label, detached, reference } = data;
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: -20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      transition={{ 
        duration: 0.6, 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      }}
      className="relative"
    >
      {/* Main Node */}
      <div className={`bg-gray-800 border rounded-lg px-3 py-2 min-w-[140px] ${
        detached 
          ? 'border-red-500' 
          : 'border-purple-500'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <CpuChipIcon className={`h-4 w-4 ${
              detached ? 'text-red-400' : 'text-purple-400'
            }`} />
            {detached && (
              <ExclamationTriangleIcon className="h-3 w-3 text-red-400" />
            )}
          </div>
          <div className={`text-xs px-2 py-0.5 rounded ${
            detached 
              ? 'bg-red-900 text-red-300' 
              : 'bg-purple-900 text-purple-300'
          }`}>
            {detached ? 'DETACHED' : 'ATTACHED'}
          </div>
        </div>
        
        {/* HEAD Label */}
        <div className="mb-1">
          <p className={`font-bold text-sm ${
            detached ? 'text-red-300' : 'text-purple-300'
          }`}>
            {label}
          </p>
        </div>
        
        {/* Reference Info */}
        <div className="space-y-1">
          <div className={`text-xs ${
            detached ? 'text-red-400' : 'text-purple-400'
          }`}>
            → {reference?.substring(0, 8)}...
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              detached ? 'bg-red-400' : 'bg-purple-400'
            }`} />
            <span className={`text-xs ${
              detached ? 'text-red-400' : 'text-purple-400'
            }`}>
              {detached ? 'Detached' : 'Linked'}
            </span>
          </div>
        </div>
        
        {/* Warning for detached HEAD */}
        {detached && (
          <div className="mt-2 p-1 bg-red-900/20 border border-red-500/30 rounded text-xs text-red-300">
            ⚠ Detached HEAD
          </div>
        )}
      </div>
      
      {/* Handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-2 h-2 border bg-gray-700 ${
          detached ? 'border-red-500' : 'border-purple-500'
        }`}
      />
    </motion.div>
  );
}

export default HeadNode;