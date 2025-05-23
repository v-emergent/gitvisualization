import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGitStore } from '../store/gitStore';
import { useThemeStore } from '../store/themeStore';
import { 
  ArrowUpIcon, 
  AcademicCapIcon, 
  CommandLineIcon,
  PlayIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

function CommandInput({ onStartTutorial }) {
  const { executeCommand, commandHistory, lastCommandOutput } = useGitStore();
  const { theme } = useThemeStore();
  const [command, setCommand] = useState('');
  const [historyPosition, setHistoryPosition] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const commandInputRef = useRef(null);
  const outputRef = useRef(null);
  
  // Scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lastCommandOutput]);
  
  // Focus the input on component mount
  useEffect(() => {
    if (commandInputRef.current) {
      commandInputRef.current.focus();
    }
  }, []);

  // Typing effect
  useEffect(() => {
    if (command.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 500);
      return () => clearTimeout(timer);
    }
  }, [command]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim()) {
      executeCommand(command);
      setCommand('');
      setHistoryPosition(-1);
    }
  };
  
  const handleKeyDown = (e) => {
    // Arrow up for history navigation
    if (e.key === 'ArrowUp' && commandHistory.length > 0) {
      e.preventDefault();
      const newPosition = historyPosition < commandHistory.length - 1 ? historyPosition + 1 : historyPosition;
      setHistoryPosition(newPosition);
      setCommand(commandHistory[commandHistory.length - 1 - newPosition] || '');
    }
    
    // Arrow down for history navigation
    if (e.key === 'ArrowDown' && historyPosition > -1) {
      e.preventDefault();
      const newPosition = historyPosition - 1;
      setHistoryPosition(newPosition);
      setCommand(newPosition >= 0 ? commandHistory[commandHistory.length - 1 - newPosition] : '');
    }
  };

  const predefinedCommands = [
    { cmd: 'git init', desc: 'Initialize repository' },
    { cmd: 'git add .', desc: 'Stage all files' },
    { cmd: 'git commit -m "Initial commit"', desc: 'Create commit' },
    { cmd: 'git branch feature', desc: 'Create branch' },
    { cmd: 'git checkout feature', desc: 'Switch branch' },
    { cmd: 'git merge feature', desc: 'Merge branch' },
    { cmd: 'git status', desc: 'Show status' },
    { cmd: 'git log', desc: 'Show history' }
  ];
  
  return (
    <div className="h-full flex flex-col cyber-terminal relative">
      {/* Terminal Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b border-cyber-green/30 bg-cyber-dark/80 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CommandLineIcon className="h-6 w-6 text-cyber-green animate-pulse-glow" />
            <div>
              <h3 className="font-cyber text-cyber-green font-bold">
                GIT.NEURAL_TERMINAL
              </h3>
              <p className="text-xs text-cyber-green/60 font-code">
                STATUS: ONLINE | MODE: INTERACTIVE
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
            <span className="text-xs text-cyber-green font-code">LIVE</span>
          </div>
        </div>
      </motion.div>
      
      {/* Terminal Output */}
      <div 
        ref={outputRef}
        className="flex-1 p-4 overflow-y-auto terminal-content cyber-glow relative"
        style={{ minHeight: '300px' }}
      >
        <AnimatePresence>
          {lastCommandOutput.length > 0 ? (
            lastCommandOutput.map((output, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="mb-6"
              >
                <div className={`font-bold mb-2 flex items-center space-x-2 ${
                  output.error ? 'text-red-400' : 'text-cyber-green'
                }`}>
                  <span className="text-cyber-cyan">neural@git:</span>
                  <span className="text-cyber-yellow">~$</span>
                  <span className={output.error ? 'text-red-400' : 'text-cyber-green'}>
                    {output.command}
                  </span>
                  {output.error && (
                    <span className="text-red-400 text-xs">[ERROR]</span>
                  )}
                </div>
                <motion.pre 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`whitespace-pre-wrap mt-1 pl-4 border-l-2 font-code text-sm ${
                    output.error 
                      ? 'border-red-400 text-red-300' 
                      : 'border-cyber-green text-cyber-green/90'
                  }`}
                >
                  {output.message}
                </motion.pre>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-cyber-green/60 italic font-code"
            >
              <div className="mb-4">
                <span className="text-cyber-cyan">&gt;</span> NEURAL INTERFACE INITIALIZED
              </div>
              <div className="mb-4">
                <span className="text-cyber-cyan">&gt;</span> GIT PROTOCOL LOADED
              </div>
              <div className="mb-6">
                <span className="text-cyber-cyan">&gt;</span> AWAITING COMMANDS...
              </div>
              
              <div className="text-cyber-yellow/70 mb-4">SUGGESTED_COMMANDS.DAT:</div>
              {predefinedCommands.slice(0, 4).map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="mb-2 pl-4 border-l-2 border-cyber-cyan/30"
                >
                  <code className="text-cyber-cyan">{item.cmd}</code>
                  <span className="text-cyber-green/50 ml-2">// {item.desc}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Command Input */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="p-4 border-t border-cyber-green/30 bg-cyber-dark/90"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center space-x-2 text-cyber-green font-code">
            <span className="text-cyber-cyan">neural@git:</span>
            <span className="text-cyber-yellow">~$</span>
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-cyber-green"
              >
                |
              </motion.span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              ref={commandInputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter Git command..."
              className="cyber-input w-full px-4 py-3 rounded-lg font-code focus:outline-none transition-all duration-300"
            />
            <div className="absolute inset-0 border border-cyber-cyan/30 rounded-lg pointer-events-none animate-pulse-glow" />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="cyber-btn cyber-btn-green px-6 py-3"
          >
            <PlayIcon className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.form>
      
      {/* Quick Commands */}
      <div className="p-4 border-t border-cyber-cyan/20 bg-cyber-dark/60">
        <h4 className="font-cyber text-cyber-cyan text-sm mb-3 flex items-center space-x-2">
          <span>QUICK_ACCESS.CMD</span>
          <ClockIcon className="h-4 w-4" />
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {predefinedCommands.map((item, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,255,255,0.1)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCommand(item.cmd)}
              className="p-2 text-left rounded border border-cyber-cyan/20 hover:border-cyber-cyan/50 transition-all font-code text-xs"
            >
              <div className="text-cyber-cyan">{item.cmd}</div>
              <div className="text-cyber-green/50 text-xs">{item.desc}</div>
            </motion.button>
          ))}
        </div>
        
        {onStartTutorial && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartTutorial}
            className="cyber-btn cyber-btn-pink w-full mt-4 py-3"
          >
            <AcademicCapIcon className="h-5 w-5 mr-2" />
            INITIATE TUTORIAL PROTOCOL
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default CommandInput;