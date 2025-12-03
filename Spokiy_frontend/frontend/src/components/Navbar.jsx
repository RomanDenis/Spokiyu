import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  // Перевіряємо, чи є токен
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token'); // Видаляємо токен
    navigate('/login'); // Перекидаємо на вхід
    window.location.reload(); // Оновлюємо сторінку
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">🌿 Спокій</div>
      <ul className="navbar-links">
        <li><Link to="/">Головна</Link></li>
        <li><Link to="/diary">Щоденник</Link></li>
        
        {/* Якщо токен є - показуємо Вихід, якщо немає - Вхід */}
        {token ? (
            <>
                <li><button onClick={handleLogout} style={{background:'none', color:'#555', border:'none', cursor:'pointer', fontSize:'1rem', padding:0}}>Вихід</button></li>
            </>
        ) : (
            <>
                <li><Link to="/login">Вхід</Link></li>
                <li><Link to="/register">Реєстрація</Link></li>
            </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;