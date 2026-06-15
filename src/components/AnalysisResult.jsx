import { getCategoryColor } from '../utils/icons';

/**
 * AnalysisResult Component
 * Displays comprehensive file analysis results in a cybersecurity dashboard layout.
 * Shows file info, detection methods, security assessment, and confidence metrics.
 */
export default function AnalysisResult({ analysis }) {
  if (!analysis) return null;

  const categoryColor = getCategoryColor(analysis.actualCategory);

  return (
    <div className="analysis-result fade-in-up">
      {/* File Identity Header */}
      <div className="result-header glass-card">
        <div className="result-header__icon-wrapper" style={{ '--accent': categoryColor }}>
          <span className="result-header__category-badge" style={{ background: categoryColor }}>
            {analysis.actualCategory}
          </span>
        </div>
        <div className="result-header__info">
          <h2 className="result-header__filename">{analysis.fileName}</h2>
          <div className="result-header__meta">
            <span className="meta-tag">{analysis.actualFormat}</span>
            <span className="meta-tag meta-tag--dim">{analysis.fileSizeFormatted}</span>
            <span className="meta-tag meta-tag--dim">
              {analysis.lastModified.toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </span>
          </div>
        </div>
        <div className={`genuine-badge ${analysis.isGenuine ? 'genuine-badge--safe' : 'genuine-badge--warning'}`}>
          {analysis.isGenuine ? '✓ Genuine' : '⚠ Suspicious'}
        </div>
      </div>

      {/* Mismatch Warning */}
      {analysis.mismatchWarning && (
        <div className="mismatch-warning glass-card fade-in-up">
          <div className="mismatch-warning__icon">⚠️</div>
          <div className="mismatch-warning__content">
            <h4>Extension Mismatch Detected</h4>
            <p>{analysis.mismatchWarning}</p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="analysis-grid">
        {/* File Details Card */}
        <div className="glass-card analysis-card fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="card-title">
            <span className="card-title__icon">📋</span>
            File Details
          </h3>
          <div className="detail-list">
            <DetailRow label="File Name" value={analysis.fileName} />
            <DetailRow label="Extension" value={analysis.extension || 'None'} />
            <DetailRow label="Actual Format" value={analysis.actualFormat} highlight />
            <DetailRow label="MIME Type" value={analysis.actualMime} />
            <DetailRow label="Category" value={analysis.actualCategory} color={categoryColor} />
            <DetailRow label="File Size" value={analysis.fileSizeFormatted} />
            <DetailRow label="Last Modified" value={analysis.lastModified.toLocaleString()} />
          </div>
        </div>

        {/* Detection Methods Card */}
        <div className="glass-card analysis-card fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="card-title">
            <span className="card-title__icon">🔍</span>
            Detection Methods
          </h3>
          <div className="detection-methods">
            <DetectionMethod
              title="Extension Detection"
              result={analysis.extensionResult}
              color="#00d2ff"
            />
            <DetectionMethod
              title="MIME Detection"
              result={analysis.mimeResult}
              color="#7c4dff"
            />
            <DetectionMethod
              title="File Signature Detection"
              result={analysis.signatureResult}
              color="#2ed573"
              isPrimary
            />
          </div>

          {/* Magic Bytes Display */}
          <div className="magic-bytes">
            <h4 className="magic-bytes__title">Magic Bytes (Hex)</h4>
            <code className="magic-bytes__code">{analysis.magicBytesHex}</code>
          </div>

          {analysis.signatureResult?.description && (
            <div className="format-description">
              <p>{analysis.signatureResult.description}</p>
            </div>
          )}
        </div>

        {/* Security Assessment Card */}
        <div className="glass-card analysis-card fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="card-title">
            <span className="card-title__icon">🛡️</span>
            Security Assessment
          </h3>
          <div className="security-assessment">
            <div className="risk-score">
              <div className="risk-score__circle" style={{ '--score': analysis.security.score }}>
                <svg viewBox="0 0 100 100" className="risk-score__svg">
                  <circle cx="50" cy="50" r="42" className="risk-score__track" />
                  <circle
                    cx="50" cy="50" r="42"
                    className="risk-score__fill"
                    style={{
                      stroke: analysis.security.statusColor,
                      strokeDasharray: `${analysis.security.score * 2.64} 264`
                    }}
                  />
                </svg>
                <div className="risk-score__value">
                  <span className="risk-score__number">{analysis.security.score}</span>
                  <span className="risk-score__label">Risk</span>
                </div>
              </div>
              <div
                className="security-status-badge"
                style={{ background: analysis.security.statusColor + '22', color: analysis.security.statusColor, borderColor: analysis.security.statusColor }}
              >
                {analysis.security.status}
              </div>
            </div>
            <div className="security-reasons">
              {analysis.security.reasons.map((reason, i) => (
                <div key={i} className="security-reason">
                  <span className="security-reason__bullet" style={{ background: analysis.security.statusColor }} />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Confidence Card */}
        <div className="glass-card analysis-card fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="card-title">
            <span className="card-title__icon">📊</span>
            Detection Confidence
          </h3>
          <div className="confidence-section">
            <div className="confidence-bar-wrapper">
              <div className="confidence-bar">
                <div
                  className="confidence-bar__fill"
                  style={{ width: `${analysis.confidence.percentage}%` }}
                />
              </div>
              <div className="confidence-info">
                <span className={`confidence-level confidence-level--${analysis.confidence.level.toLowerCase()}`}>
                  {analysis.confidence.level} Confidence
                </span>
                <span className="confidence-percent">{analysis.confidence.percentage}%</span>
              </div>
            </div>
            <div className="confidence-methods">
              <h4>Methods Used:</h4>
              <div className="method-tags">
                {analysis.confidence.methods.map((method, i) => (
                  <span key={i} className="method-tag">{method}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Preview */}
      <FilePreview analysis={analysis} />
    </div>
  );
}

/** Detail row sub-component */
function DetailRow({ label, value, highlight, color }) {
  return (
    <div className="detail-row">
      <span className="detail-row__label">{label}</span>
      <span
        className={`detail-row__value ${highlight ? 'detail-row__value--highlight' : ''}`}
        style={color ? { color } : {}}
      >
        {value}
      </span>
    </div>
  );
}

/** Detection method sub-component */
function DetectionMethod({ title, result, color, isPrimary }) {
  return (
    <div className={`detection-method ${isPrimary ? 'detection-method--primary' : ''}`}>
      <div className="detection-method__header">
        <div className="detection-method__dot" style={{ background: result ? color : '#636e72' }} />
        <span className="detection-method__title">{title}</span>
        <span className={`detection-method__status ${result ? 'detection-method__status--active' : ''}`}>
          {result ? 'Detected' : 'N/A'}
        </span>
      </div>
      {result && (
        <div className="detection-method__details">
          <span>Format: <strong>{result.format}</strong></span>
          {result.mime && <span>MIME: <strong>{result.mime}</strong></span>}
          <span>Confidence: <strong>{result.confidence}</strong></span>
        </div>
      )}
    </div>
  );
}

/** File preview sub-component */
function FilePreview({ analysis }) {
  const { file, actualCategory, imageDimensions } = analysis;
  const previewUrl = URL.createObjectURL(file);

  const renderPreview = () => {
    switch (actualCategory) {
      case 'Image':
        return (
          <div className="preview-image-container">
            <img
              src={previewUrl}
              alt={file.name}
              className="preview-image"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            {imageDimensions && (
              <div className="preview-image__dimensions">
                {imageDimensions.width} × {imageDimensions.height} px
              </div>
            )}
          </div>
        );

      case 'Audio':
        return (
          <div className="preview-audio-container">
            <div className="audio-visualizer">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="audio-bar"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    height: `${20 + Math.random() * 60}%`
                  }}
                />
              ))}
            </div>
            <audio controls src={previewUrl} className="preview-audio">
              Your browser does not support the audio element.
            </audio>
          </div>
        );

      case 'Video':
        return (
          <div className="preview-video-container">
            <video controls src={previewUrl} className="preview-video">
              Your browser does not support the video element.
            </video>
          </div>
        );

      default:
        return (
          <div className="preview-generic">
            <div className="preview-generic__icon">
              {actualCategory === 'Document' ? '📄' : '📁'}
            </div>
            <p className="preview-generic__text">
              Preview not available for {analysis.actualFormat} files
            </p>
          </div>
        );
    }
  };

  return (
    <div className="glass-card analysis-card preview-card fade-in-up" style={{ animationDelay: '0.5s' }}>
      <h3 className="card-title">
        <span className="card-title__icon">👁️</span>
        File Preview
      </h3>
      {renderPreview()}
    </div>
  );
}
