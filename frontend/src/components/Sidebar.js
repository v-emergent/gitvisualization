import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderIcon, 
  FolderOpenIcon,
  DocumentIcon,
  CodeBracketIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ShareIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useGitStore } from '../store/gitStore';

function Sidebar() {
  const { repository, commandHistory } = useGitStore();
  const [expandedSections, setExpandedSections] = useState({
    files: true,
    branches: true,
    commits: false,
    history: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const fileTreeData = [
    { name: 'src/', type: 'folder', children: [
      { name: 'components/', type: 'folder', children: [
        { name: 'Header.js', type: 'file' },
        { name: 'GitVisualization.js', type: 'file' },
        { name: 'CommandInput.js', type: 'file' }
      ]},
      { name: 'store/', type: 'folder', children: [
        { name: 'gitStore.js', type: 'file' },
        { name: 'themeStore.js', type: 'file' }
      ]},
      { name: 'App.js', type: 'file' },
      { name: 'index.js', type: 'file' }
    ]},
    { name: 'public/', type: 'folder', children: [
      { name: 'index.html', type: 'file' },
      { name: 'favicon.ico', type: 'file' }
    ]},
    { name: 'package.json', type: 'file' },
    { name: 'README.md', type: 'file' },
    { name: '.gitignore', type: 'file' }
  ];

  const FileTreeItem = ({ item, level = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(level < 2);
    
    return (
      <div>
        <motion.div
          whileHover={{ x: 2, backgroundColor: 'rgba(0,255,255,0.05)' }}
          onClick={() => item.children && setIsExpanded(!isExpanded)}
          className={`cyber-tree-item cursor-pointer flex items-center space-x-2`}
          style={{ paddingLeft: `${(level + 1) * 16}px` }}
        >
          {item.children ? (
            <>
              {isExpanded ? (
                <ChevronDownIcon className="h-3 w-3 text-cyber-cyan" />
              ) : (
                <ChevronRightIcon className="h-3 w-3 text-cyber-cyan" />
              )}
              {isExpanded ? (
                <FolderOpenIcon className="h-4 w-4 text-cyber-yellow" />
              ) : (
                <FolderIcon className="h-4 w-4 text-cyber-yellow" />
              )}
            </>
          ) : (
            <>
              <div className="w-3" />
              <DocumentIcon className="h-4 w-4 text-cyber-green" />
            </>
          )}
          <span className="text-sm font-code">{item.name}</span>
        </motion.div>
        
        <AnimatePresence>
          {item.children && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {item.children.map((child, index) => (
                <FileTreeItem key={index} item={child} level={level + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const SectionHeader = ({ title, section, icon: Icon, count }) => (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(0,255,255,0.1)' }}
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between p-3 cursor-pointer border-b border-cyber-cyan/20"
    >
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-cyber-cyan" />
        <span className="font-cyber text-sm text-cyber-cyan">{title}</span>
        {count && (
          <span className="text-xs bg-cyber-cyan/20 text-cyber-cyan px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      {expandedSections[section] ? (
        <ChevronDownIcon className="h-4 w-4 text-cyber-cyan" />
      ) : (
        <ChevronRightIcon className="h-4 w-4 text-cyber-cyan" />
      )}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-80 bg-cyber-dark/50 backdrop-blur-sm border-r border-cyber-cyan/20 h-full overflow-y-auto"
    >
      {/* Explorer Header */}
      <div className="p-4 border-b border-cyber-cyan/20">
        <h2 className="font-cyber text-cyber-cyan text-lg font-bold">
          &gt; NEURAL_EXPLORER
        </h2>
        <p className="text-xs text-cyber-cyan/60 font-code mt-1">
          SCANNING FILE_SYSTEM.DAT...
        </p>
      </div>

      {/* File Tree */}
      <div className="cyber-panel m-2">
        <SectionHeader 
          title="FILE_TREE.SYS" 
          section="files" 
          icon={FolderIcon}
          count={fileTreeData.length}
        />
        <AnimatePresence>
          {expandedSections.files && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="py-2">
                {fileTreeData.map((item, index) => (
                  <FileTreeItem key={index} item={item} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Branches */}
      <div className="cyber-panel m-2 mt-4">
        <SectionHeader 
          title="BRANCH_NET.DAT" 
          section="branches" 
          icon={ShareIcon}
          count={Object.keys(repository.branches).length}
        />
        <AnimatePresence>
          {expandedSections.branches && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="py-2">
                {Object.entries(repository.branches).map(([name, commitId]) => (
                  <motion.div
                    key={name}
                    whileHover={{ x: 2, backgroundColor: 'rgba(0,255,255,0.05)' }}
                    className={`cyber-tree-item flex items-center space-x-2 ${
                      name === repository.currentBranch ? 'bg-cyber-cyan/10' : ''
                    }`}
                  >
                    <GitBranchIcon className="h-4 w-4 text-cyber-green" />
                    <span className="text-sm font-code text-cyber-cyan">
                      {name}
                      {name === repository.currentBranch && ' *'}
                    </span>
                    <span className="text-xs text-cyber-cyan/50 font-code">
                      {commitId?.substring(0, 7)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Commits */}
      <div className="cyber-panel m-2 mt-4">
        <SectionHeader 
          title="COMMIT_LOG.SYS" 
          section="commits" 
          icon={ClockIcon}
          count={Object.keys(repository.commits).length}
        />
        <AnimatePresence>
          {expandedSections.commits && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="py-2 max-h-48 overflow-y-auto">
                {Object.values(repository.commits)
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .slice(0, 10)
                  .map((commit) => (
                    <motion.div
                      key={commit.id}
                      whileHover={{ x: 2, backgroundColor: 'rgba(0,255,255,0.05)' }}
                      className="cyber-tree-item flex items-start space-x-2 py-2"
                    >
                      <div 
                        className="w-3 h-3 rounded-full mt-0.5 animate-pulse-glow"
                        style={{ backgroundColor: commit.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-code text-cyber-cyan truncate">
                          {commit.message}
                        </p>
                        <p className="text-xs text-cyber-cyan/50 font-code">
                          {commit.id.substring(0, 7)} • {commit.author}
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Command History */}
      <div className="cyber-panel m-2 mt-4">
        <SectionHeader 
          title="CMD_HISTORY.LOG" 
          section="history" 
          icon={CodeBracketIcon}
          count={commandHistory.length}
        />
        <AnimatePresence>
          {expandedSections.history && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="py-2 max-h-48 overflow-y-auto">
                {commandHistory.slice(-10).reverse().map((cmd, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 2, backgroundColor: 'rgba(0,255,65,0.05)' }}
                    className="cyber-tree-item"
                  >
                    <span className="text-xs font-code text-cyber-green">
                      &gt; {cmd}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Sidebar;