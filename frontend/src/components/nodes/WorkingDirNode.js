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
        return <PlusIcon className="h-3 w-3 text-green-400" />;
      case 'modified':
        return <PencilIcon className="h-3 w-3 text-yellow-400" />;
      case 'deleted':
        return <TrashIcon className="h-3 w-3 text-red-400" />;
      default:
        return <DocumentIcon className="h-3 w-3 text-gray-400" />;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'text-green-400';
      case 'modified':
        return 'text-yellow-400';
      case 'deleted':
        return 'text-red-400';
      default:
        return 'text-gray-400';
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
      {/* Main Node */}
      <div className="bg-gray-800 border border-yellow-600 rounded-lg p-3 min-w-[160px] max-w-[200px]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <FolderIcon className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-300 font-bold text-xs">
              WORKING DIR
            </span>
          </div>
          <div className="text-xs bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded">
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
                {getStatusIcon(file.status)}
                <span className={getStatusColor(file.status)}>
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
            <p className="text-xs text-yellow-400">
              No changes
            </p>
          </div>
        )}
        
        {/* Status */}
        <div className="mt-2 pt-1 border-t border-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            <span className="text-xs text-yellow-400">
              {files.length > 0 ? 'Modified' : 'Clean'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="working-to-index"
        className="w-2 h-2 border border-yellow-400 bg-gray-700"
      />
    </motion.div>
  );
}

export default WorkingDirNode;