import React from 'react';
import { motion } from 'framer-motion';
import { Handle, Position } from 'reactflow';
import { 
  UserIcon, 
  ClockIcon,
  DocumentIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

function CommitNode({ data }) {
  const { label, id, author, timestamp, color, files = [] } = data;
  const formattedDate = new Date(timestamp).toLocaleString();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Main Node */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 min-w-[180px] max-w-[220px]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-white text-xs font-bold">
              {id}
            </span>
          </div>
          <CodeBracketIcon className="h-3 w-3 text-gray-400" />
        </div>
        
        {/* Commit Message */}
        <div className="mb-2">
          <p className="text-sm text-white break-words">
            {label}
          </p>
        </div>
        
        {/* Metadata */}
        <div className="space-y-1 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <UserIcon className="h-3 w-3" />
            <span>{author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-3 w-3" />
            <span>{new Date(timestamp).toLocaleDateString()}</span>
          </div>
          {files.length > 0 && (
            <div className="flex items-center space-x-1">
              <DocumentIcon className="h-3 w-3" />
              <span>{files.length} file(s)</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 border border-gray-400 bg-gray-700"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 border border-gray-400 bg-gray-700"
      />
    </motion.div>
  );
}

export default CommitNode;