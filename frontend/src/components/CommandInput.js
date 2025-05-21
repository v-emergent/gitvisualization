import { useState, useRef, useEffect } from 'react';
import { useGitStore } from '../store/gitStore';
import { useThemeStore } from '../store/themeStore';
import { ArrowUpIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

function CommandInput({ onStartTutorial }) {
  const { executeCommand, commandHistory, lastCommandOutput } = useGitStore();
  const { theme } = useThemeStore();
  const [command, setCommand] = useState('');
  const [historyPosition, setHistoryPosition] = useState(-1);
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
  
  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
      <div className={`p-3 font-mono text-sm ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900'} rounded-t-lg`}>
        Git Command Terminal
      </div>
      
      <div 
        ref={outputRef}
        className={`flex-1 p-4 font-mono text-sm overflow-y-auto ${theme === 'dark' ? 'bg-gray-950 text-gray-300' : 'bg-gray-50 text-gray-800'}`}
        style={{ minHeight: '300px', maxHeight: '50vh' }}
      >
        {lastCommandOutput.length > 0 ? (
          lastCommandOutput.map((output, idx) => (
            <div key={idx} className="mb-4">
              <div className={`font-bold ${output.error ? 'text-red-500' : (theme === 'dark' ? 'text-green-400' : 'text-green-600')}`}>
                $ {output.command}
              </div>
              <pre className="whitespace-pre-wrap mt-1 pl-2 border-l-2 border-gray-600">
                {output.message}
              </pre>
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic">
            Type a Git command below to get started. For example:
            <pre className="mt-2 pl-2 border-l-2 border-gray-600">git init</pre>
            <pre className="mt-2 pl-2 border-l-2 border-gray-600">git commit -m "Initial commit"</pre>
            <pre className="mt-2 pl-2 border-l-2 border-gray-600">git branch feature</pre>
            <pre className="mt-2 pl-2 border-l-2 border-gray-600">git checkout feature</pre>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="mt-2">
        <div className={`flex border ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'} rounded-lg overflow-hidden`}>
          <span className={`px-3 py-2 font-mono ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>$</span>
          <input
            ref={commandInputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type Git command here... (e.g., git init)"
            className={`flex-1 p-2 font-mono outline-none ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
          />
          <button
            type="submit"
            className={`px-4 py-2 ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            <ArrowUpIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
      
      <div className="mt-4">
        <h3 className="font-medium mb-2">Supported Commands:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>git init</div>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>git add [file]</div>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>git commit -m "message"</div>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>git branch [name]</div>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>git checkout [branch]</div>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>git merge [branch]</div>
        </div>
        
        {onStartTutorial && (
          <div className="mt-6">
            <button
              onClick={onStartTutorial}
              className={`w-full py-2 px-4 ${theme === 'dark' ? 'bg-green-700 hover:bg-green-800' : 'bg-green-600 hover:bg-green-700'} text-white rounded-md flex items-center justify-center`}
            >
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              Start Guided Tutorial
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommandInput;
