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
      {/* Intense Glow Effect for HEAD */}
      <div className="absolute inset-0 rounded-lg blur-xl opacity-70 animate-glow-rotate bg-gradient-to-r from-cyber-purple via-cyber-pink to-cyber-cyan" />
      
      {/* Main Node */}
      <div className={`relative backdrop-blur-sm border-3 rounded-lg px-4 py-3 min-w-[160px] ${
        detached 
          ? 'bg-red-500/20 border-red-500' 
          : 'bg-cyber-purple/20 border-cyber-purple'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <CpuChipIcon className={`h-6 w-6 ${
                detached ? 'text-red-400' : 'text-cyber-purple'
              }`} />
            </motion.div>
            {detached && (
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 animate-pulse" />
            )}
          </div>
          <div className={`text-xs font-code px-2 py-0.5 rounded ${
            detached 
              ? 'bg-red-500/30 text-red-400' 
              : 'bg-cyber-purple/30 text-cyber-purple'
          }`}>
            {detached ? 'DETACHED' : 'ATTACHED'}
          </div>
        </div>
        
        {/* HEAD Label */}
        <div className="mb-2">
          <p className={`font-cyber font-black text-lg ${
            detached ? 'text-red-400' : 'text-cyber-purple'
          }`}>
            {label}
          </p>
        </div>
        
        {/* Reference Info */}
        <div className="space-y-1">
          <div className={`text-xs font-code ${
            detached ? 'text-red-300/80' : 'text-cyber-purple/80'
          }`}>
            TARGET: {reference?.substring(0, 10)}...
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              detached ? 'bg-red-400' : 'bg-cyber-purple'
            }`} />
            <span className={`text-xs font-code ${
              detached ? 'text-red-300/80' : 'text-cyber-purple/80'
            }`}>
              {detached ? 'FLOATING_STATE' : 'BRANCH_LINKED'}
            </span>
          </div>
        </div>
        
        {/* Warning for detached HEAD */}
        {detached && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs font-code text-red-300"
          >
            ⚠ DETACHED HEAD STATE
          </motion.div>
        )}
        
        {/* Animated Circuit Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none rounded-lg overflow-hidden">
          <motion.div
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${detached ? 'ff4444' : '8000ff'}' fill-opacity='0.3'%3E%3Cpath d='M15 15.5V13H14V15.5H11.5V16H14V18.5H15V16H17.5V15.5H15ZM18.5 6V4.5H17V6H15.5V7H17V8.5H18.5V7H20V6H18.5Z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />
        </div>
      </div>
      
      {/* Handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-4 h-4 border-3 bg-cyber-dark ${
          detached ? 'border-red-500' : 'border-cyber-purple'
        }`}
      />
    </motion.div>
  );
}

export default HeadNode;