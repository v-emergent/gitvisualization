import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import GitVisualization from "./components/GitVisualization";
import CommandInput from "./components/CommandInput";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TutorialModal from "./components/TutorialModal";
import { useGitStore } from "./store/gitStore";
import { useThemeStore } from "./store/themeStore";

function App() {
  const { theme } = useThemeStore();
  const { initialized, initializeRepository } = useGitStore();
  const [showWelcome, setShowWelcome] = useState(!initialized);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('visualization');

  useEffect(() => {
    if (!initialized) {
      setShowWelcome(true);
    } else {
      setShowWelcome(false);
    }
  }, [initialized]);

  const handleStartDemo = () => {
    initializeRepository();
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen bg-cyber-dark relative overflow-hidden circuit-bg">
      {/* Cyberpunk background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyber-purple/5 via-transparent to-cyber-pink/5 pointer-events-none" />
      
      <Header />
      
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[80vh] px-4 relative z-10"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center max-w-4xl"
            >
              <h1 className="text-6xl font-cyber font-black mb-6 bg-gradient-to-r from-cyber-cyan via-cyber-pink to-cyber-green bg-clip-text text-transparent animate-glow-rotate">
                GIT.VISUALIZER
              </h1>
              <div className="cyber-panel p-8 mb-8">
                <p className="text-xl text-cyber-cyan/90 font-code leading-relaxed">
                  &gt; NEURAL INTERFACE DETECTED<br/>
                  &gt; INITIALIZING GIT PROTOCOL...<br/>
                  &gt; LEARN VERSION CONTROL THROUGH CYBERNETIC VISUALIZATION
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartDemo}
                  className="cyber-btn cyber-btn-cyan text-lg px-8 py-3"
                >
                  &gt; INITIALIZE_DEMO.EXE
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    initializeRepository();
                    setShowWelcome(false);
                    setIsTutorialOpen(true);
                  }}
                  className="cyber-btn cyber-btn-green text-lg px-8 py-3"
                >
                  &gt; TUTORIAL_MODE.EXE
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-[calc(100vh-4rem)]"
          >
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              {/* Tab Navigation */}
              <div className="border-b border-cyber-cyan/20 bg-cyber-dark/50 backdrop-blur-sm">
                <div className="flex space-x-1 px-6">
                  <button
                    onClick={() => setActiveTab('visualization')}
                    className={`cyber-tab ${activeTab === 'visualization' ? 'active' : ''}`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>📊</span>
                      <span>NEURAL_MAP.VIZ</span>
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('terminal')}
                    className={`cyber-tab ${activeTab === 'terminal' ? 'active' : ''}`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>⚡</span>
                      <span>TERMINAL.SYS</span>
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 flex">
                {/* Main Content */}
                <div className="flex-1 p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === 'visualization' ? (
                      <motion.div
                        key="visualization"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <GitVisualization />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="terminal"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <CommandInput onStartTutorial={() => setIsTutorialOpen(true)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Right Panel - Command Input when visualization is active */}
                {activeTab === 'visualization' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="w-96 border-l border-cyber-cyan/20 bg-cyber-dark/30"
                  >
                    <CommandInput onStartTutorial={() => setIsTutorialOpen(true)} />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Modal */}
      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
    </div>
  );
}

export default App;