import { useState, useRef, useCallback } from 'react';

/**
 * DropZone Component
 * Handles file uploads via drag-and-drop or file browser.
 * Features cybersecurity-themed styling with animated borders and particle effects.
 */
export default function DropZone({ onFileSelect, isAnalyzing }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
      // Reset the input so the same file can be re-uploaded
      e.target.value = '';
    }
  };

  return (
    <div
      id="drop-zone"
      className={`drop-zone ${isDragOver ? 'drop-zone--active' : ''} ${isAnalyzing ? 'drop-zone--analyzing' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleBrowse}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-input"
      />

      {/* Animated border */}
      <div className="drop-zone__border" />

      {/* Scanning line animation */}
      {isAnalyzing && <div className="drop-zone__scan-line" />}

      <div className="drop-zone__content">
        {isAnalyzing ? (
          <>
            <div className="drop-zone__spinner">
              <div className="spinner-ring" />
              <div className="spinner-ring spinner-ring--inner" />
            </div>
            <h3 className="drop-zone__title">Analyzing File...</h3>
            <p className="drop-zone__subtitle">Scanning file signatures and metadata</p>
          </>
        ) : (
          <>
            <div className="drop-zone__icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h3 className="drop-zone__title">
              {isDragOver ? 'Release to Analyze' : 'Drop File Here'}
            </h3>
            <p className="drop-zone__subtitle">
              or <span className="drop-zone__browse-text">Browse Files</span>
            </p>
            <p className="drop-zone__hint">
              Supports all file types • Max analysis in milliseconds
            </p>
          </>
        )}
      </div>

      {/* Corner decorations */}
      <div className="drop-zone__corner drop-zone__corner--tl" />
      <div className="drop-zone__corner drop-zone__corner--tr" />
      <div className="drop-zone__corner drop-zone__corner--bl" />
      <div className="drop-zone__corner drop-zone__corner--br" />
    </div>
  );
}
