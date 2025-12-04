import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Користувач';
  const token = localStorage.getItem('token');

  // Состояние темной темы (проверяем localStorage при старте)
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  // Проверка авторизации
  useEffect(() => {
    if (!token) {
      // Используем setTimeout, чтобы избежать конфликтов рендеринга
      setTimeout(() => navigate('/login'), 0);
    }
  }, [token, navigate]);

  // Если токена нет, ничего не рендерим (ждем редиректа)
  if (!token) return null;

  // Логика переключения темы
  const toggleTheme = () => {
    if (isDarkMode) {
      // Выключаем
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      // Включаем
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Особистий Кабінет</h1>

      <div className="profile-grid">
        
        {/* ЛЕВАЯ КОЛОНКА: ИНФО */}
        <div className="card profile-card">
          <div className="profile-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <h2>{username}</h2>
          <p className="profile-status">Статус: <span>Активний 🌿</span></p>
        </div>

        {/* ПРАВАЯ КОЛОНКА: НАСТРОЙКИ */}
        <div className="card settings-card">
          <h3>Налаштування</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <h4>Сповіщення</h4>
              <p>Нагадувати про записи щодня</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4>Темна тема</h4>
              <p>Зменшити навантаження на очі</p>
            </div>
            {/* ПОДКЛЮЧИЛИ ЛОГИКУ СЮДА */}
            <label className="switch">
              <input 
                type="checkbox" 
                checked={isDarkMode} 
                onChange={toggleTheme} 
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="setting-divider"></div>

          <button onClick={handleLogout} className="logout-btn">
            Вийти з акаунту
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;