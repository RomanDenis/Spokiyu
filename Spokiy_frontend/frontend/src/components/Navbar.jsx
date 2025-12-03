import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        🌿 Спокій
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Головна</Link></li>
        <li><Link to="/diary">Щоденник</Link></li>
        <li><Link to="/stats">Статистика</Link></li>
        <li><Link to="/profile">Кабінет</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;