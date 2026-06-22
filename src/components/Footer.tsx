export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-copy">© {year} Rinneagan. All rights reserved.</p>
        <ul className="footer-links">
          <li><a href="https://github.com/Rinneagan" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </footer>
  );
}
