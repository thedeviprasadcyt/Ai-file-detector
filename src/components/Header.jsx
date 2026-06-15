/**
 * Header Component
 * Cybersecurity-themed navigation header with animated logo and particle background.
 */
export default function Header() {
  return (
    <header className="header" id="header">
      <div className="header__container">
        <div className="header__logo">
          <div className="header__logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d2ff" />
                  <stop offset="100%" stopColor="#7c4dff" />
                </linearGradient>
              </defs>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" stroke="#2ed573" strokeWidth="2.5" />
            </svg>
            <div className="header__logo-pulse" />
          </div>
          <div className="header__title-group">
            <h1 className="header__title">
              <span className="header__title-ai">AI</span> File Format Detector
            </h1>
            <p className="header__subtitle">Advanced File Analysis & Security Assessment</p>
          </div>
        </div>
        <div className="header__badge">
          <span className="header__status-dot" />
          <span className="header__status-text">System Active</span>
        </div>
      </div>
    </header>
  );
}
