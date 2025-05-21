import { useState, useEffect } from "react";
import "./App.css";
import GitVisualization from "./components/GitVisualization";
import CommandInput from "./components/CommandInput";
import Header from "./components/Header";
import TutorialModal from "./components/TutorialModal";
import { useGitStore } from "./store/gitStore";
import { useThemeStore } from "./store/themeStore";

function App() {
  const { theme } = useThemeStore();
  const { initialized, initializeRepository } = useGitStore();
  const [showWelcome, setShowWelcome] = useState(!initialized);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

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
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleStartDemo}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Start Demo Repository
            </button>
            <button
              onClick={() => {
                initializeRepository();
                setShowWelcome(false);
                setIsTutorialOpen(true);
              }}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Start Guided Tutorial
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 pt-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GitVisualization />
            </div>
            <div className="lg:col-span-1">
              <CommandInput onStartTutorial={() => setIsTutorialOpen(true)} />
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Modal */}
      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
    </div>
  );
}

export default App;
