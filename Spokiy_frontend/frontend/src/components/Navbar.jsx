import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login'); 
    window.location.reload();
  };

  return (
    <nav className="navbar">
      {/* Логотип веде на сторінку "Про проєкт" (/about) */}
      <Link to="/about" className="navbar-brand" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', height: '100%', overflow: 'visible'}}>
        <img 
          src="/logo.png" 
          alt="Спокій" 
          style={{
            height: '55px',
            width: 'auto', 
            objectFit: 'contain',
            mixBlendMode: 'multiply',
            display: 'block'
          }} 
        />
      </Link>

      <ul className="navbar-links">
        
        {token ? (
            <>
                {/* ЛОГІЧНА НАВІГАЦІЯ */}
                <li><Link to="/">Головна</Link></li>
                <li><Link to="/diary">Щоденник</Link></li>
                <li><Link to="/stats">Статистика</Link></li>
                <li><Link to="/profile">Налаштування</Link></li>
                <li>
                  <button onClick={handleLogout} className="nav-btn-logout">
                    Вихід
                  </button>
                </li>
            </>
        ) : (
            <>
                <li><Link to="/about">Про проєкт</Link></li>
                <li><Link to="/login">Вхід</Link></li>
                <li><Link to="/register" style={{color: '#2E7D32', fontWeight: 'bold'}}>Реєстрація</Link></li>
            </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;