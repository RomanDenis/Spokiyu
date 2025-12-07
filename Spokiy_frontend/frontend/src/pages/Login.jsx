import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Запит до Django
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username: username,
        password: password
      });

      // Збереження токена
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username); // Зберігаємо ім'я для профілю

      // Перехід до щоденника
      navigate('/diary');
      // window.location.reload(); // Зазвичай в React це не потрібно, navigate достатньо
    } catch (err) {
      console.error("Login error:", err);
      setError("Невірний логін або пароль. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="split-screen">
      {/* Ліва частина - Декор */}
      <div className="split-left">
        <h1>З поверненням! 🌿</h1>
        <p>
          Твій шлях до ментальної рівноваги продовжується тут. 
          Ми раді бачити тебе знову.
        </p>
      </div>

      {/* Права частина - Форма */}
      <div className="split-right">
        <div className="auth-form-wrapper">
          <h2>Вхід у систему</h2>
          
          {error && (
            <div style={{
              background: '#FFEBEE', color: '#D32F2F', padding: '10px', 
              borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div>
              <label>Логін</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введіть ваш логін"
                required
              />
            </div>
            <div>
              <label>Пароль</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введіть ваш пароль"
                required
              />
            </div>
            
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Вхід...' : 'Увійти'}
            </button>
          </form>
          
          <p style={{marginTop: '25px', textAlign: 'center', color: '#666'}}>
            Немає акаунту? <Link to="/register" style={{color: '#2E7D32', fontWeight: 'bold', textDecoration: 'none'}}>Зареєструватися</Link>
          </p>
          <p style={{marginTop: '10px', textAlign: 'center'}}>
             <Link to="/" style={{color: '#999', fontSize: '0.9rem', textDecoration: 'none'}}>← На головну</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;