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
      {/* 1. Посилання веде на "/about" -> це відкриває Лендінг навіть для тих, хто увійшов.
          2. Стилі логотипу:
             - height: 160% (трохи виступає за межі рядка, щоб бути більшим)
             - mix-blend-mode: multiply (робить білий фон картинки прозорим на фоні меню)
      */}
      <Link to="/about" className="navbar-brand" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', height: '100%', overflow: 'visible'}}>
        <img 
          src="/logo.png" 
          alt="Спокій" 
          style={{
            height: '55px',        /* Фіксована висота, трохи більша за стандарт */
            width: 'auto', 
            objectFit: 'contain',
            mixBlendMode: 'multiply', /* Магія: білий фон стає прозорим */
            display: 'block'
          }} 
        />
      </Link>

      <ul className="navbar-links">
        
        {token ? (
            <>
                {/* Додаємо кнопку "Кабінет", щоб користувач міг повернутися на Дашборд з Лендінгу */}
                <li><Link to="/">Кабінет</Link></li>
                <li><Link to="/diary">Щоденник</Link></li>
                <li><Link to="/stats">Статистика</Link></li>
                <li><Link to="/profile">Профіль</Link></li>
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