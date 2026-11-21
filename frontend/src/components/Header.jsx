function Header() {
  return (
    <header className="header">
      <div>
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your financial overview.</p>
      </div>

      <div className="header-right">
        <button className="icon-button">⌕</button>
        <button className="icon-button">♧</button>

        <div className="header-avatar">L</div>
      </div>
    </header>
  );
}

export default Header;