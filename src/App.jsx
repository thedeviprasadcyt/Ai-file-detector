import { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import DropZone from './components/DropZone';
import AnalysisResult from './components/AnalysisResult';
import UploadHistory from './components/UploadHistory';
import { analyzeFile } from './utils/fileAnalyzer';

/**
 * App Component
 * Root application component for the AI File Format Detector.
 * Manages file analysis state, upload history, and error handling.
 */
export default function App() {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  /** Handle file selection from DropZone */
  const handleFileSelect = useCallback(async (file) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      // Small delay for UX - shows the scanning animation
      await new Promise(resolve => setTimeout(resolve, 800));

      const result = await analyzeFile(file);
      setAnalysis(result);

      // Add to history (most recent first)
      setHistory(prev => [result, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /** Clear upload history */
  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <div className="app">
      {/* Animated background grid */}
      <div className="cyber-bg">
        <div className="cyber-bg__grid" />
        <div className="cyber-bg__glow cyber-bg__glow--1" />
        <div className="cyber-bg__glow cyber-bg__glow--2" />
        <div className="cyber-bg__glow cyber-bg__glow--3" />
      </div>

      <Header />

      <main className="main" id="main-content">
        <div className="container">
          {/* Drop Zone */}
          <DropZone onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />

          {/* Error Display */}
          {error && (
            <div className="error-card glass-card fade-in-up" id="error-display">
              <div className="error-card__icon">⚠️</div>
              <div className="error-card__content">
                <h4>Analysis Failed</h4>
                <p>{error}</p>
              </div>
              <button
                className="error-card__close"
                onClick={() => setError(null)}
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && <AnalysisResult analysis={analysis} />}

          {/* Upload History */}
          <UploadHistory history={history} onClearHistory={handleClearHistory} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
