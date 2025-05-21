import { useState, useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useGitStore } from '../store/gitStore';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const tutorialSteps = [
  {
    title: "Welcome to Git Visualizer",
    content: "This tutorial will guide you through basic Git operations, showing how each command affects the repository structure. Let's get started!",
    command: null,
  },
  {
    title: "Initialize a Repository",
    content: "First, let's initialize a new Git repository. This is typically the first step when starting a new project with Git.",
    command: "git init",
  },
  {
    title: "Make Your First Commit",
    content: "Now that we have a repository, let's create our first commit. In a real project, this would typically happen after adding some files to track.",
    command: "git commit -m \"Initial commit\"",
  },
  {
    title: "Create a New Branch",
    content: "Branches let you develop features, fix bugs, or experiment with new ideas in a contained area of your repository, without affecting the main branch.",
    command: "git branch feature",
  },
  {
    title: "Switch to the Feature Branch",
    content: "Let's switch to our new branch to make some changes. Notice how the HEAD pointer moves to point to the feature branch.",
    command: "git checkout feature",
  },
  {
    title: "Make Changes on the Feature Branch",
    content: "Now that we're on the feature branch, let's make a commit. This will create a new commit that only exists on the feature branch.",
    command: "git commit -m \"Add new feature\"",
  },
  {
    title: "Switch Back to Main",
    content: "Let's switch back to the main branch. Notice how the HEAD pointer moves back to main, and our repository visualization shows that the main branch doesn't include our feature commit.",
    command: "git checkout main",
  },
  {
    title: "Merge the Feature Branch",
    content: "Now let's merge our feature branch into main. This will incorporate all the changes from the feature branch into the main branch.",
    command: "git merge feature",
  },
  {
    title: "Create and Checkout a New Branch",
    content: "You can create and switch to a new branch in one command using the -b flag with checkout.",
    command: "git checkout -b bugfix",
  },
  {
    title: "Make a Bugfix Commit",
    content: "Let's make a commit on our bugfix branch.",
    command: "git commit -m \"Fix critical bug\"",
  },
  {
    title: "Tutorial Complete!",
    content: "You've completed the basic Git commands tutorial! You can now continue experimenting with Git commands on your own or reset the repository to start fresh.",
    command: null,
  },
];

function TutorialModal({ isOpen, onClose }) {
  const { theme } = useThemeStore();
  const { executeCommand } = useGitStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    // Reset to first step when modal opens
    if (isOpen) {
      setCurrentStep(0);
      setIsExecuting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExecuteStep = () => {
    const step = tutorialSteps[currentStep];
    if (step.command) {
      setIsExecuting(true);
      executeCommand(step.command);
      // Wait a bit to show the command executing
      setTimeout(() => {
        setIsExecuting(false);
      }, 800);
    }
  };

  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close modal when clicking outside
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl max-w-lg w-full overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Git Tutorial</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">{`Step ${currentStep + 1} of ${tutorialSteps.length}`}</span>
            <div className="h-2 bg-gray-700 rounded-full flex-1 mx-4">
              <div 
                className="h-2 bg-blue-500 rounded-full" 
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3">{currentTutorialStep.title}</h3>
          <p className="mb-6">{currentTutorialStep.content}</p>

          {currentTutorialStep.command && (
            <div className={`p-3 rounded mb-6 font-mono text-sm ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
              {currentTutorialStep.command}
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-md flex items-center ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Previous
            </button>

            {currentTutorialStep.command ? (
              <button
                onClick={handleExecuteStep}
                disabled={isExecuting}
                className={`px-6 py-2 bg-blue-600 text-white rounded-md ${isExecuting ? 'opacity-75 cursor-wait' : 'hover:bg-blue-700'}`}
              >
                {isExecuting ? 'Executing...' : 'Execute Command'}
              </button>
            ) : (
              currentStep === tutorialSteps.length - 1 ? (
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  Finish Tutorial
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                >
                  Cancel Tutorial
                </button>
              )
            )}

            <button
              onClick={handleNextStep}
              disabled={currentStep === tutorialSteps.length - 1}
              className={`px-4 py-2 rounded-md flex items-center ${currentStep === tutorialSteps.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
            >
              Next
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorialModal;
