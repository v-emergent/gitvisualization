import { useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { XMarkIcon } from '@heroicons/react/24/outline';

function HelpModal({ isOpen, onClose }) {
  const { theme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('basics');

  if (!isOpen) return null;

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
        className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl max-w-3xl w-full h-[80vh] flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Git Visualizer Help</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex border-b border-gray-700">
          <button
            className={`px-4 py-2 ${activeTab === 'basics' ? 
              (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200') : ''} font-medium`}
            onClick={() => setActiveTab('basics')}
          >
            Basics
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'commands' ? 
              (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200') : ''} font-medium`}
            onClick={() => setActiveTab('commands')}
          >
            Commands
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'visualization' ? 
              (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200') : ''} font-medium`}
            onClick={() => setActiveTab('visualization')}
          >
            Visualization
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'basics' && (
            <div>
              <h3 className="text-lg font-medium mb-3">What is Git Visualizer?</h3>
              <p className="mb-4">
                Git Visualizer is a web-based tool that helps you understand Git workflows by providing a visual representation of how Git commands affect your repository structure.
              </p>
              
              <h3 className="text-lg font-medium mb-3">Getting Started</h3>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>Click the "Start Demo Repository" button on the welcome screen</li>
                <li>Use the command terminal on the right to execute Git commands</li>
                <li>Watch how the repository visualization updates in real-time</li>
                <li>Use the reset button in the header if you want to start over</li>
              </ol>

              <h3 className="text-lg font-medium mb-3">Interface Elements</h3>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Visualization Area:</strong> Shows your Git repository structure with commits, branches, and HEAD</li>
                <li><strong>Command Terminal:</strong> Enter Git commands to manipulate the repository</li>
                <li><strong>Theme Toggle:</strong> Switch between dark and light modes</li>
                <li><strong>Reset Button:</strong> Clear your repository and start fresh</li>
              </ul>
            </div>
          )}

          {activeTab === 'commands' && (
            <div>
              <h3 className="text-lg font-medium mb-3">Supported Git Commands</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className="font-medium mb-2">git init</h4>
                  <p className="text-sm">Initializes a new Git repository.</p>
                  <pre className="mt-2 text-xs bg-black text-green-400 p-2 rounded">$ git init</pre>
                </div>
                
                <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className="font-medium mb-2">git commit</h4>
                  <p className="text-sm">Creates a new commit with the given message.</p>
                  <pre className="mt-2 text-xs bg-black text-green-400 p-2 rounded">$ git commit -m "Your message"</pre>
                </div>
                
                <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className="font-medium mb-2">git branch</h4>
                  <p className="text-sm">Creates a new branch or lists existing branches.</p>
                  <pre className="mt-2 text-xs bg-black text-green-400 p-2 rounded">$ git branch feature</pre>
                  <pre className="mt-1 text-xs bg-black text-green-400 p-2 rounded">$ git branch</pre>
                </div>
                
                <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className="font-medium mb-2">git checkout</h4>
                  <p className="text-sm">Switches branches or creates and switches to a new branch.</p>
                  <pre className="mt-2 text-xs bg-black text-green-400 p-2 rounded">$ git checkout branch_name</pre>
                  <pre className="mt-1 text-xs bg-black text-green-400 p-2 rounded">$ git checkout -b new_branch</pre>
                </div>
                
                <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className="font-medium mb-2">git merge</h4>
                  <p className="text-sm">Merges one branch into the current branch.</p>
                  <pre className="mt-2 text-xs bg-black text-green-400 p-2 rounded">$ git merge branch_name</pre>
                </div>
                
                <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className="font-medium mb-2">git status</h4>
                  <p className="text-sm">Shows the state of the working directory and staging area.</p>
                  <pre className="mt-2 text-xs bg-black text-green-400 p-2 rounded">$ git status</pre>
                </div>

                <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className="font-medium mb-2">git reset</h4>
                  <p className="text-sm">Resets current HEAD to the specified state. Has different modes:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                    <li><strong>--soft</strong>: Only moves HEAD pointer</li>
                    <li><strong>--mixed</strong>: Moves HEAD and updates staging area (default)</li>
                    <li><strong>--hard</strong>: Moves HEAD, updates staging area and working directory</li>
                  </ul>
                  <pre className="mt-2 text-xs bg-black text-green-400 p-2 rounded">$ git reset --soft HEAD~1</pre>
                  <pre className="mt-1 text-xs bg-black text-green-400 p-2 rounded">$ git reset --hard commit_id</pre>
                </div>
                
                <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className="font-medium mb-2">git revert</h4>
                  <p className="text-sm">Creates a new commit that undoes changes from a specific commit.</p>
                  <p className="text-xs mt-1">Unlike reset, revert doesn't remove commits from history.</p>
                  <pre className="mt-2 text-xs bg-black text-green-400 p-2 rounded">$ git revert commit_id</pre>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-3">Command History</h3>
              <p>
                Use the up and down arrow keys in the command terminal to navigate through your command history.
              </p>
            </div>
          )}

          {activeTab === 'visualization' && (
            <div>
              <h3 className="text-lg font-medium mb-3">Understanding the Visualization</h3>
              
              <div className="space-y-4">
                <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className="font-medium mb-2">Commit Nodes</h4>
                  <p>Rectangular nodes representing Git commits. Each commit includes:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Commit hash (truncated to 7 characters)</li>
                    <li>Commit message</li>
                    <li>Author and timestamp</li>
                  </ul>
                </div>
                
                <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className="font-medium mb-2">Branch Labels</h4>
                  <p>Rounded labels indicating branches in the repository. The current branch is highlighted in green.</p>
                </div>
                
                <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className="font-medium mb-2">HEAD Pointer</h4>
                  <p>The red "HEAD" label shows where you're currently positioned in the repository. It can point to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>A branch (normal state)</li>
                    <li>A specific commit (detached HEAD state)</li>
                  </ul>
                </div>
                
                <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className="font-medium mb-2">Connections</h4>
                  <p>Different types of connections between nodes:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Solid lines: Parent-child relationships between commits</li>
                    <li>Dashed green lines: Branch references to commits</li>
                    <li>Animated red line: HEAD pointer to its target</li>
                  </ul>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mt-6 mb-3">Navigation Tips</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Use the mouse wheel to zoom in and out</li>
                <li>Click and drag to pan around the visualization</li>
                <li>Use the minimap in the corner for quick navigation</li>
                <li>Use the controls to reset the view, zoom in/out, or fit the view</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
