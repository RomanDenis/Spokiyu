import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Diary() {
  const [text, setText] = useState('');
  const [moodLevel, setMoodLevel] = useState(5);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  // 1. Дістаємо токен
  const token = localStorage.getItem('token');

  // Налаштування "перепустки" для сервера
  const authConfig = {
    headers: {
      'Authorization': `Token ${token}`
    }
  };

  const fetchHistory = async () => {
    // Якщо токена немає - не намагаємося вантажити, зразу на вхід
    if (!token) return;

    try {
      // ПЕРЕДАЄМО authConfig
      const response = await axios.get('http://127.0.0.1:8000/api/mood-records/', authConfig);
      setHistory(response.data);
    } catch (error) {
      console.error("Помилка історії", error);
      if (error.response && error.response.status === 401) {
        navigate('/login'); // Токен протух -> на вхід
      }
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchHistory();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ТУТ ТЕЖ ВАЖЛИВО передати authConfig третім аргументом
      await axios.post('http://127.0.0.1:8000/api/mood-records/', {
        text: text,
        mood_level: moodLevel
      }, authConfig);
      
      // Очищення і оновлення
      setText('');
      setMoodLevel(5);
      fetchHistory(); 
    } catch (error) {
      console.error(error);
      alert("Не вдалося зберегти запис. Перевірте консоль (F12).");
    }
  };

  // Красива дата
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('uk-UA', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="diary-container">
      <h2 style={{textAlign: 'center', color: '#2E7D32'}}>Щоденник {token ? "(Ви увійшли)" : ""}</h2>
      
      <div className="card form-card">
        <h3>Новий запис</h3>
        <form onSubmit={handleSubmit}>
          <textarea 
            rows="3" 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="Опишіть свій стан..." 
            required 
          />
          <div className="range-container">
            <label>Настрій: {moodLevel}/10</label>
            <input type="range" min="1" max="10" value={moodLevel} onChange={(e) => setMoodLevel(e.target.value)} />
          </div>
          <button type="submit">Зберегти</button>
        </form>
      </div>

      <div className="history-section">
        <h3>Ваша історія</h3>
        {history.length === 0 ? (
          <p style={{textAlign:'center', color:'#888'}}>
            Тут поки пусто. Зробіть свій перший запис під цим акаунтом!
          </p>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-card">
                <div className="history-header">
                  <span className="history-date">{formatDate(item.date)}</span>
                  <span className={`mood-badge ${item.mood_level >= 5 ? 'mood-good' : 'mood-bad'}`}>{item.mood_level}/10</span>
                </div>
                <p className="history-text">{item.text}</p>
                {item.recommendation && <small style={{display:'block', marginTop:'10px', color:'#2E7D32'}}>💡 {item.recommendation}</small>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Diary;