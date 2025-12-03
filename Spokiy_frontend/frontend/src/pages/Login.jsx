import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username: username,
        password: password
      });
      localStorage.setItem('token', response.data.token);
      navigate('/diary');
      window.location.reload(); 
    } catch (error) {
      alert("Невірний логін або пароль!");
    }
  };

  return (
    <div className="split-screen">
      {/* Ліва частина - Декор */}
      <div className="split-left">
        <h1>З поверненням!</h1>
        <p>Ми раді бачити вас знову. Продовжуйте свій шлях до спокою та рівноваги.</p>
      </div>

      {/* Права частина - Форма */}
      <div className="split-right">
        <div className="auth-form-wrapper">
          <h2>Вхід у систему</h2>
          <form onSubmit={handleLogin}>
            <div style={{marginBottom: '20px'}}>
              <label>Логін</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введіть ваш логін"
                required
              />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label>Пароль</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введіть ваш пароль"
                required
              />
            </div>
            <button type="submit">Увійти</button>
          </form>
          
          <p style={{marginTop: '20px', textAlign: 'center', color: '#666'}}>
            Немає акаунту? <Link to="/register" style={{color: '#2E7D32', fontWeight: 'bold'}}>Зареєструватися</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;