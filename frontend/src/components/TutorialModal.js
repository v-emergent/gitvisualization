import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PlayIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useGitStore } from '../store/gitStore';
import { useThemeStore } from '../store/themeStore';

function TutorialModal({ isOpen, onClose }) {
  const { executeCommand } = useGitStore();
  const { theme } = useThemeStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  
  const tutorialSteps = [
    {
      title: "INITIALIZE_NEURAL_REPOSITORY",
      description: "Boot up the Git neural network and initialize the version control matrix.",
      command: "git init",
      explanation: "NEURAL_INIT creates quantum repository structure. Watch as the main branch manifests in the cybersphere."
    },
    {
      title: "STAGE_DATA_PACKETS",
      description: "Upload local file changes to the staging buffer for processing.",
      command: "git add .",
      explanation: "DATA_TRANSFER initiated. Files migrate from working directory to staging area through neural pathways."
    },
    {
      title: "COMMIT_TO_BLOCKCHAIN",
      description: "Crystallize your changes into an immutable commit block in the version chain.",
      command: 'git commit -m "Initial neural upload"',
      explanation: "COMMIT_BLOCK generated. Your data snapshot is now permanently encoded in the Git blockchain."
    },
    {
      title: "SPAWN_FEATURE_BRANCH",
      description: "Create a parallel development dimension for isolated feature work.",
      command: "git branch feature/cyber-enhancement",
      explanation: "BRANCH_DIMENSION created. A new timeline diverges from the main neural pathway."
    },
    {
      title: "NEURAL_JUMP_SEQUENCE",
      description: "Transfer consciousness to the new branch dimension.",
      command: "git checkout feature/cyber-enhancement",
      explanation: "CONSCIOUSNESS_TRANSFER complete. HEAD pointer now locked onto the feature branch timeline."
    },
    {
      title: "ENHANCE_NEURAL_DATA",
      description: "Inject new data packets and create another commit block.",
      command: "git add . && git commit -m \"Neural enhancement complete\"",
      explanation: "DATA_ENHANCEMENT uploaded. Branch timeline now contains advanced neural modifications."
    },
    {
      title: "MERGE_REALITIES",
      description: "Integrate the enhanced timeline back into the main neural network.",
      command: "git checkout main && git merge feature/cyber-enhancement",
      explanation: "REALITY_MERGE executed. All timeline branches converge into unified neural network state."
    }
  ];

  const handleExecuteStep = async () => {
    if (currentStep >= tutorialSteps.length) return;
    
    setIsExecuting(true);
    const step = tutorialSteps[currentStep];
    
    executeCommand(step.command);
    
    setTimeout(() => {
      setIsExecuting(false);
      setCurrentStep(prev => prev + 1);
    }, 1500);
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  if (!isOpen) return null;

  const isCompleted = currentStep >= tutorialSteps.length;
  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-cyber-dark/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl w-full max-h-[90vh] overflow-y-auto cyber-panel relative"
        >
          {/* Background Circuit Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none circuit-bg" />
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-cyber-cyan/30">
            <div>
              <h2 className="text-3xl font-cyber font-black text-cyber-cyan">
                NEURAL_TUTORIAL.SYS
              </h2>
              <p className="text-sm text-cyber-cyan/70 font-code mt-1">
                &gt; INITIALIZING GIT CONSCIOUSNESS TRANSFER PROTOCOL
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="p-3 text-cyber-pink hover:text-cyber-pink border border-cyber-pink/30 hover:border-cyber-pink rounded-lg cyber-glow"
            >
              <XMarkIcon className="h-6 w-6" />
            </motion.button>
          </div>

          <div className="p-6">
            {!isCompleted ? (
              <>
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-3 font-code">
                    <span className="text-cyber-cyan">PROGRESS.DAT</span>
                    <span className="text-cyber-green">
                      {currentStep + 1} / {tutorialSteps.length}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-cyber-dark/50 rounded-full h-3 border border-cyber-cyan/30">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-cyber-cyan to-cyber-pink h-full rounded-full animate-pulse-glow"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-[shimmer_2s_infinite]" />
                  </div>
                </div>

                {/* Current Step */}
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <h3 className="text-2xl font-cyber font-bold mb-4 text-cyber-pink">
                    STEP_{currentStep + 1}: {currentTutorialStep.title}
                  </h3>
                  <p className="mb-6 text-cyber-cyan/90 font-code text-lg leading-relaxed">
                    {currentTutorialStep.description}
                  </p>
                  
                  {/* Command Terminal */}
                  <div className="cyber-terminal mb-6 relative overflow-hidden">
                    <div className="terminal-content p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 font-code">
                          <span className="text-cyber-green">neural@git:</span>
                          <span className="text-cyber-yellow">~$</span>
                          <motion.span 
                            className="text-cyber-cyan"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {currentTutorialStep.command}
                          </motion.span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleExecuteStep}
                          disabled={isExecuting}
                          className={`cyber-btn ${isExecuting ? 'opacity-50' : 'cyber-btn-green'} flex items-center space-x-2`}
                        >
                          <PlayIcon className="h-5 w-5" />
                          <span>{isExecuting ? 'EXECUTING...' : 'EXECUTE.CMD'}</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Explanation Panel */}
                  <div className="cyber-panel bg-cyber-purple/10 border-cyber-purple/30 p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-cyber-purple/20 border border-cyber-purple rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-cyber-purple text-xs font-bold">i</span>
                      </div>
                      <div>
                        <h4 className="font-cyber text-cyber-purple font-bold mb-2">
                          NEURAL_EXPLANATION.DOC
                        </h4>
                        <p className="text-sm font-code text-cyber-purple/90 leading-relaxed">
                          {currentTutorialStep.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            ) : (
              /* Completion Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-gradient-to-br from-cyber-green to-cyber-cyan rounded-full flex items-center justify-center mx-auto mb-8 cyber-glow-strong"
                >
                  <CheckIcon className="w-12 h-12 text-cyber-dark" />
                </motion.div>
                
                <h3 className="text-4xl font-cyber font-black mb-4 bg-gradient-to-r from-cyber-green via-cyber-cyan to-cyber-pink bg-clip-text text-transparent">
                  NEURAL_UPLOAD COMPLETE!
                </h3>
                
                <p className="text-cyber-cyan/80 font-code text-lg mb-8 max-w-lg mx-auto">
                  &gt; CONSCIOUSNESS SUCCESSFULLY INTERFACED WITH GIT NEURAL NETWORK<br/>
                  &gt; ALL PROTOCOLS LEARNED AND INTEGRATED<br/>
                  &gt; READY FOR ADVANCED OPERATIONS
                </p>
                
                <div className="flex justify-center space-x-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="cyber-btn cyber-btn-cyan px-8 py-3 text-lg"
                  >
                    RESTART_NEURAL.EXE
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="cyber-btn cyber-btn-pink px-8 py-3 text-lg"
                  >
                    EXIT_TUTORIAL.SYS
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default TutorialModal;
