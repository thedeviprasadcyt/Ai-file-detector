/**
 * Footer Component
 * Minimal footer with developer attribution.
 */
export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__container">
        <div className="footer__line" />
        <p className="footer__text">
          Developed by <span className="footer__author">Devi</span>
          <span className="footer__year">@2026</span>
        </p>
      </div>
    </footer>
  );
}
