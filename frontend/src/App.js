import { useState, useEffect } from "react";
import "./App.css";
import GitVisualization from "./components/GitVisualization";
import CommandInput from "./components/CommandInput";
import Header from "./components/Header";
import { useGitStore } from "./store/gitStore";
import { useThemeStore } from "./store/themeStore";

function App() {
  const { theme } = useThemeStore();
  const { initialized, initializeRepository } = useGitStore();
  const [showWelcome, setShowWelcome] = useState(!initialized);

  useEffect(() => {
    // Check if the repository is already initialized
    if (!initialized) {
      setShowWelcome(true);
    }
  }, [initialized]);

  const handleStartDemo = () => {
    initializeRepository();
    setShowWelcome(false);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Header />
      
      {showWelcome ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <h1 className="text-4xl font-bold mb-6">Git Visualizer</h1>
          <p className="text-xl mb-8 text-center max-w-2xl">
            Learn Git through interactive visualizations. See how Git commands affect your repository in real-time.
          </p>
          <button
            onClick={handleStartDemo}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Start Demo Repository
          </button>
        </div>
      ) : (
        <div className="container mx-auto px-4 pt-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GitVisualization />
            </div>
            <div className="lg:col-span-1">
              <CommandInput />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
