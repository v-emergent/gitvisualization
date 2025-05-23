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
      {/* Main Node */}
      <div className="bg-gray-800 border border-cyan-600 rounded-lg p-2 min-w-[130px] max-w-[160px]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <ArchiveBoxIcon className="h-4 w-4 text-cyan-400" />
            <span className="text-cyan-300 font-bold text-xs">
              STAGING
            </span>
          </div>
          <div className="text-xs bg-cyan-900 text-cyan-300 px-2 py-0.5 rounded">
            {files.length}
          </div>
        </div>
        
        {/* Files List */}
        {files.length > 0 ? (
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {files.slice(0, 3).map((file, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2 p-1 bg-gray-700 rounded text-xs"
              >
                <CheckIcon className="h-3 w-3 text-green-400" />
                <span className="text-cyan-300">
                  {file.name}
                </span>
              </div>
            ))}
            {files.length > 3 && (
              <div className="text-xs text-gray-400 text-center">
                +{files.length - 3} more
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-2">
            <ArchiveBoxIcon className="h-6 w-6 text-cyan-400/40 mx-auto mb-1" />
            <p className="text-xs text-cyan-400">
              No files staged
            </p>
          </div>
        )}
        
        {/* Status */}
        <div className="mt-2 pt-1 border-t border-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            <span className="text-xs text-cyan-400">
              {files.length > 0 ? 'Ready' : 'Empty'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="working-to-index"
        className="w-2 h-2 border border-cyan-400 bg-gray-700"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="index-to-commit"
        className="w-2 h-2 border border-cyan-400 bg-gray-700"
      />
    </motion.div>
  );
}

export default IndexNode;