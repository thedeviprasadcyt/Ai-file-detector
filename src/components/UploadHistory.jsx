import { getSecurityIcon } from '../utils/icons';
import { formatFileSize } from '../utils/fileAnalyzer';

/**
 * UploadHistory Component
 * Displays session upload history with file details and security status.
 * Supports export and clear operations.
 */
export default function UploadHistory({ history, onClearHistory }) {
  if (history.length === 0) return null;

  /** Copy analysis data to clipboard */
  const handleCopyAnalysis = async (item) => {
    const text = formatAnalysisText(item);
    try {
      await navigator.clipboard.writeText(text);
      showToast('Analysis copied to clipboard!');
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Analysis copied to clipboard!');
    }
  };

  /** Download analysis as JSON */
  const handleDownloadJSON = (item) => {
    const data = {
      fileName: item.fileName,
      fileSize: item.fileSize,
      fileSizeFormatted: item.fileSizeFormatted,
      extension: item.extension,
      actualFormat: item.actualFormat,
      actualMime: item.actualMime,
      actualCategory: item.actualCategory,
      formatDescription: item.formatDescription,
      browserMime: item.browserMime,
      isGenuine: item.isGenuine,
      mismatchWarning: item.mismatchWarning,
      lastModified: item.lastModified,
      analyzedAt: item.analyzedAt,
      magicBytesHex: item.magicBytesHex,
      imageDimensions: item.imageDimensions,
      security: {
        status: item.security.status,
        score: item.security.score,
        reasons: item.security.reasons
      },
      confidence: item.confidence,
      detectionResults: {
        extension: item.extensionResult ? {
          format: item.extensionResult.format,
          mime: item.extensionResult.mime,
          category: item.extensionResult.category,
          confidence: item.extensionResult.confidence
        } : null,
        mime: item.mimeResult ? {
          format: item.mimeResult.format,
          mime: item.mimeResult.mime,
          category: item.mimeResult.category,
          confidence: item.mimeResult.confidence
        } : null,
        signature: item.signatureResult ? {
          format: item.signatureResult.format,
          mime: item.signatureResult.mime,
          category: item.signatureResult.category,
          confidence: item.signatureResult.confidence,
          description: item.signatureResult.description
        } : null,
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_${item.fileName.replace(/[^a-z0-9]/gi, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Analysis downloaded as JSON!');
  };

  /** Download all analyses as a combined JSON */
  const handleDownloadAll = () => {
    const allData = history.map(item => ({
      fileName: item.fileName,
      actualFormat: item.actualFormat,
      actualCategory: item.actualCategory,
      security: item.security.status,
      riskScore: item.security.score,
      confidence: item.confidence.level,
      analyzedAt: item.analyzedAt,
    }));

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `file_analysis_history_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Full history downloaded!');
  };

  return (
    <div className="upload-history fade-in-up">
      <div className="history-header">
        <h3 className="history-title">
          <span className="card-title__icon">📜</span>
          Upload History
          <span className="history-count">{history.length}</span>
        </h3>
        <div className="history-actions">
          <button
            className="btn btn--outline btn--sm"
            onClick={handleDownloadAll}
            id="btn-download-all"
            title="Download all analyses as JSON"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export All
          </button>
          <button
            className="btn btn--danger btn--sm"
            onClick={onClearHistory}
            id="btn-clear-history"
            title="Clear upload history"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Clear
          </button>
        </div>
      </div>

      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item glass-card">
            <div className="history-item__icon">
              {getSecurityIcon(item.security.status)}
            </div>
            <div className="history-item__info">
              <span className="history-item__name" title={item.fileName}>
                {item.fileName}
              </span>
              <div className="history-item__meta">
                <span className="meta-tag meta-tag--sm">{item.actualFormat}</span>
                <span className="meta-tag meta-tag--sm meta-tag--dim">{item.fileSizeFormatted}</span>
                <span className="history-item__time">
                  {item.analyzedAt.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            <div className="history-item__status">
              <span
                className="status-pill"
                style={{
                  background: item.security.statusColor + '22',
                  color: item.security.statusColor,
                  borderColor: item.security.statusColor
                }}
              >
                {item.security.status}
              </span>
            </div>
            <div className="history-item__actions">
              <button
                className="btn-icon"
                onClick={() => handleCopyAnalysis(item)}
                title="Copy analysis"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
              <button
                className="btn-icon"
                onClick={() => handleDownloadJSON(item)}
                title="Download as JSON"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Format analysis as readable text for clipboard */
function formatAnalysisText(item) {
  return `
═══════════════════════════════════════
  AI File Format Detector - Analysis
═══════════════════════════════════════

📁 File: ${item.fileName}
📏 Size: ${item.fileSizeFormatted}
📅 Last Modified: ${item.lastModified.toLocaleString()}

🔍 Detection Results:
  • Extension: ${item.extension || 'None'}
  • Actual Format: ${item.actualFormat}
  • MIME Type: ${item.actualMime}
  • Category: ${item.actualCategory}

🛡️ Security: ${item.security.status} (Risk: ${item.security.score}/100)
  ${item.security.reasons.map(r => '• ' + r).join('\n  ')}

📊 Confidence: ${item.confidence.level} (${item.confidence.percentage}%)
  Methods: ${item.confidence.methods.join(', ')}

${item.isGenuine ? '✅ File appears genuine' : '⚠️ ' + item.mismatchWarning}

🔮 Magic Bytes: ${item.magicBytesHex}

═══════════════════════════════════════
  Analyzed at: ${item.analyzedAt.toLocaleString()}
═══════════════════════════════════════
`.trim();
}

/** Show a toast notification */
function showToast(message) {
  // Remove existing toast if any
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('toast-notification--visible'));

  setTimeout(() => {
    toast.classList.remove('toast-notification--visible');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
