import { useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useGitStore } from '../store/gitStore';
import { SunIcon, MoonIcon, ArrowPathIcon, CodeBracketIcon, QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import HelpModal from './HelpModal';

function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const { resetRepository } = useGitStore();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleReset = () => {
    resetRepository();
    setIsResetModalOpen(false);
  };

  return (
    <header className={`py-4 px-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <CodeBracketIcon className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">Git Visualizer</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="flex items-center px-3 py-1.5 rounded-md border border-gray-400 hover:bg-opacity-20 hover:bg-gray-500"
            title="Help"
          >
            <QuestionMarkCircleIcon className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Help</span>
          </button>
          
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="flex items-center px-3 py-1.5 rounded-md border border-gray-400 hover:bg-opacity-20 hover:bg-gray-500"
            title="Reset Repository"
          >
            <ArrowPathIcon className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          
          <button
            onClick={toggleTheme}
            className="flex items-center px-3 py-1.5 rounded-md border border-gray-400 hover:bg-opacity-20 hover:bg-gray-500"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <>
                <SunIcon className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <MoonIcon className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            // Close modal when clicking outside
            if (e.target === e.currentTarget) {
              setIsResetModalOpen(false);
            }
          }}
        >
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} max-w-md w-full relative`}>
            <button 
              onClick={() => setIsResetModalOpen(false)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-700"
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold mb-4">Reset Repository?</h3>
            <p className="mb-6">This will clear all commits, branches, and history. Are you sure you want to continue?</p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="px-6 py-3 rounded-md border border-gray-400 font-medium"
              >
                No, Keep Repository
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                style={{ position: 'relative', zIndex: 60 }}
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </header>
  );
}

export default Header;
