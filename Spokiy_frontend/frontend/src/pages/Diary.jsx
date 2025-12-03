import { useState, useEffect } from 'react'
import axios from 'axios'


function Diary() {
  const [text, setText] = useState('')
  const [moodLevel, setMoodLevel] = useState(5)
  const [history, setHistory] = useState([]) // Тут храним список записей

  // 1. Функция для загрузки истории с сервера
  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/mood-records/')
      setHistory(response.data)
    } catch (error) {
      console.error("Не вдалося завантажити історію", error)
    }
  }

  // 2. Запускаем загрузку 1 раз при открытии страницы
  useEffect(() => {
    fetchHistory()
  }, [])

  // 3. Отправка новой записи
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://127.0.0.1:8000/api/mood-records/', {
        text: text,
        mood_level: moodLevel
      })
      // Очищаем форму
      setText('')
      setMoodLevel(5)
      // Оновлюємо список історії, щоб побачити новий запис
      fetchHistory() 
    } catch (error) {
      alert("Помилка з'єднання")
    }
  }

  // Допоміжна функція для красивої дати (День тижня, число, час)
  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleString('uk-UA', {
      weekday: 'long', // понеділок
      year: 'numeric',
      month: 'long',   // грудня
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="app-container">
      <h1>🌿 Мій Щоденник</h1>
      
      {/* Картка додавання нового запису */}
      <div className="card form-card">
        <h3>Новий запис</h3>
        <form onSubmit={handleSubmit}>
          <textarea 
            rows="3" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Як пройшов ваш день? (Наприклад: I feel productive today)"
            required
          />
          
          <div className="range-container">
            <label>Настрій: {moodLevel}/10</label>
            <input 
              type="range" min="1" max="10" 
              value={moodLevel}
              onChange={(e) => setMoodLevel(e.target.value)}
            />
          </div>

          <button type="submit">Зберегти в щоденник</button>
        </form>
      </div>

      {/* Блок історії (Стрічка щоденника) */}
      <div className="history-section">
        <h2>📜 Історія записів</h2>
        
        {history.length === 0 ? (
          <p style={{textAlign: 'center', color: '#888'}}>Поки що записів немає...</p>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-card">
                <div className="history-header">
                  <span className="history-date">{formatDate(item.date)}</span>
                  <span className={`mood-badge mood-${item.mood_level >= 5 ? 'good' : 'bad'}`}>
                    Настрій: {item.mood_level}
                  </span>
                </div>
                
                <p className="history-text">{item.text}</p>
                
                <div className="history-footer">
                  <small>Тональність: {item.sentiment_score.toFixed(2)}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Diary