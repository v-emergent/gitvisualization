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
      {/* Glow Effect */}
      <div 
        className="absolute inset-0 rounded-lg blur-md opacity-50 animate-pulse-glow"
        style={{ backgroundColor: color }}
      />
      
      {/* Main Node */}
      <div className="relative bg-cyber-dark/90 backdrop-blur-sm border-2 rounded-lg p-4 min-w-[220px] max-w-[300px]"
           style={{ borderColor: color }}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full animate-pulse-glow"
              style={{ backgroundColor: color }}
            />
            <span className="font-cyber text-cyber-cyan text-sm font-bold">
              COMMIT #{id}
            </span>
          </div>
          <CodeBracketIcon className="h-4 w-4 text-cyber-green" />
        </div>
        
        {/* Commit Message */}
        <div className="mb-3">
          <p className="text-sm font-code text-white break-words">
            {label}
          </p>
        </div>
        
        {/* Metadata */}
        <div className="space-y-2 text-xs font-code">
          <div className="flex items-center space-x-2 text-cyber-cyan/80">
            <UserIcon className="h-3 w-3" />
            <span>{author}</span>
          </div>
          <div className="flex items-center space-x-2 text-cyber-cyan/80">
            <ClockIcon className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
          {files.length > 0 && (
            <div className="flex items-center space-x-2 text-cyber-green/80">
              <DocumentIcon className="h-3 w-3" />
              <span>{files.length} file(s)</span>
            </div>
          )}
        </div>
        
        {/* Files List */}
        {files.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-3 pt-2 border-t border-cyber-cyan/20"
          >
            <div className="text-xs font-code text-cyber-green/70">
              Files changed:
            </div>
            <div className="mt-1 max-h-20 overflow-y-auto">
              {files.slice(0, 3).map((file, idx) => (
                <div key={idx} className="text-xs font-code text-cyber-cyan/60">
                  + {file.name}
                </div>
              ))}
              {files.length > 3 && (
                <div className="text-xs font-code text-cyber-cyan/40">
                  ... and {files.length - 3} more
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Circuit Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none rounded-lg"
             style={{ 
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='0.3'%3E%3Cpath d='M20 20.5V18H19V20.5H16.5V21H19V23.5H20V21H22.5V20.5H20ZM23.5 11V9.5H22V11H20.5V12H22V13.5H23.5V12H25V11H23.5Z'/%3E%3C/g%3E%3C/svg%3E")` 
             }}
        />
      </div>
      
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-cyber-cyan bg-cyber-dark"
        style={{ borderColor: color }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-cyber-cyan bg-cyber-dark"
        style={{ borderColor: color }}
      />
    </motion.div>
  );
}

export default CommitNode;