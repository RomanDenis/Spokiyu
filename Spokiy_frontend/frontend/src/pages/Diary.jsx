import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Если файл лежит в src/pages, то путь к App.css в src/ будет ../App.css
import '../App.css'; 

const AVAILABLE_TAGS = [
  '😴 Сон', '💻 Робота', '🎓 Навчання', '🏃 Спорт', 
  '🍔 Їжа', '🎮 Відпочинок', '👨‍👩‍👧‍👦 Сім’я', '❤️ Побачення'
];

function Diary() {
  const [text, setText] = useState('');
  const [moodLevel, setMoodLevel] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  
  // --- НОВЫЕ ПЕРЕМЕННЫЕ ДЛЯ ДАТЫ ---
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDate, setCustomDate] = useState('');
  
  const [history, setHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const authConfig = { headers: { 'Authorization': `Token ${token}` } };

  // EMOJI HELPERS
  const getMoodEmoji = (level) => {
    if (level <= 2) return '😭';
    if (level <= 4) return '😔';
    if (level <= 6) return '😐';
    if (level <= 8) return '🙂';
    return '🤩';
  };

  const getMoodLabel = (level) => {
    if (level <= 2) return 'Жахливо';
    if (level <= 4) return 'Так собі';
    if (level <= 6) return 'Нормально';
    if (level <= 8) return 'Добре';
    return 'Чудово!';
  };

  // API: Загрузка
  const fetchHistory = async () => {
    if (!token) return;
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/mood-records/', authConfig);
      setHistory(response.data);
    } catch (error) {
      if (error.response?.status === 401) navigate('/login');
    }
  };

  useEffect(() => {
    if (!token) navigate('/login');
    else fetchHistory();
  }, [token]);

  // API: Удаление
  const handleDelete = async (id) => {
    if(!window.confirm("Видалити цей запис?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/mood-records/${id}/`, authConfig);
      fetchHistory();
    } catch (error) { alert("Помилка видалення"); }
  };

  // API: Отправка (С УЧЕТОМ ДАТЫ)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 1. Формируем текст с тегами
    let finalText = text;
    if (selectedTags.length > 0) {
      finalText += "\n\n" + selectedTags.map(t => `#${t.split(' ')[1]}`).join(' ');
    }

    // 2. Собираем данные
    const payload = {
      text: finalText,
      mood_level: moodLevel
    };

    // 3. Если выбрана дата - добавляем её
    if (showDatePicker && customDate) {
      payload.date = customDate;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/mood-records/', payload, authConfig);
      
      // Сброс формы
      setText('');
      setMoodLevel(5);
      setSelectedTags([]);
      setShowDatePicker(false);
      setCustomDate('');
      
      fetchHistory();
    } catch (error) { 
      alert("Помилка збереження"); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag));
    else setSelectedTags([...selectedTags, tag]);
  };

  // ГРУППИРОВКА ПО ДНЯМ
  const groupedHistory = history.reduce((acc, item) => {
    const dateKey = new Date(item.date).toLocaleDateString('uk-UA', { 
      weekday: 'long', day: 'numeric', month: 'long' 
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  const calculateDailyAvg = (items) => {
    const sum = items.reduce((acc, curr) => acc + curr.mood_level, 0);
    return (sum / items.length).toFixed(1);
  };

  // Текущая дата для max атрибута
  const nowISO = new Date().toISOString().slice(0, 16);

  return (
    <div className="diary-page-wrapper" style={{paddingTop: '30px', paddingBottom: '50px'}}>
      <div className="diary-grid">
        
        {/* === ЛЕВАЯ КОЛОНКА: ФОРМА === */}
        <aside className="diary-sidebar">
          <div className="card form-card" style={{margin: 0}}>
            <h2 style={{textAlign:'center', color:'#333', marginTop:0}}>Як ти зараз?</h2>
            
            <form onSubmit={handleSubmit}>
              
              {/* Слайдер */}
              <div style={{textAlign: 'center', margin: '25px 0'}}>
                <div style={{fontSize: '4.5rem', marginBottom:'10px', transition:'0.2s', lineHeight: 1}}>
                  {getMoodEmoji(moodLevel)}
                </div>
                <div style={{color: '#2E7D32', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px'}}>
                  {getMoodLabel(moodLevel)} ({moodLevel}/10)
                </div>
                <input 
                  type="range" min="1" max="10" 
                  value={moodLevel} 
                  onChange={(e) => setMoodLevel(parseInt(e.target.value))} 
                />
              </div>

              {/* Теги */}
              <div className="tags-container">
                {AVAILABLE_TAGS.map(tag => (
                  <div 
                    key={tag} 
                    className={`tag-chip ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </div>
                ))}
              </div>

              {/* Текст */}
              <textarea 
                rows="4" 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                placeholder="Опишіть свої думки..." 
                required 
              />

              {/* --- ВЫБОР ДАТЫ (СТИЛЬНО И БЕЗ ВЫЛЕЗАНИЯ) --- */}
              <div style={{marginBottom: '20px'}}>
                <button 
                  type="button" 
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  style={{
                    background: showDatePicker ? '#FFEBEE' : 'transparent', 
                    color: showDatePicker ? '#D32F2F' : '#757575', 
                    border: showDatePicker ? '1px solid #FFCDD2' : '1px dashed #BDBDBD', 
                    borderRadius: '12px',
                    padding: '10px',
                    width: '100%',
                    fontSize: '0.9rem', 
                    fontWeight: '600',
                    cursor: 'pointer', 
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {showDatePicker ? (
                    <><span>✖</span> Скасувати дату</>
                  ) : (
                    <><span>📅</span> Це було в інший час?</>
                  )}
                </button>

                {showDatePicker && (
                  <div style={{
                    marginTop: '15px', 
                    animation: 'fadeIn 0.3s ease-out',
                    background: '#FFFFFF',
                    padding: '15px',
                    borderRadius: '16px',
                    border: '1px solid #E0E0E0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    boxSizing: 'border-box', // Важно: границы внутри ширины
                    width: '100%' // Гарантирует, что блок не шире родителя
                  }}>
                    <label style={{
                      fontSize: '0.85rem', 
                      fontWeight: '700', 
                      display: 'block', 
                      marginBottom: '8px', 
                      color:'#2E7D32',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Час події
                    </label>
                    <input 
                      type="datetime-local" 
                      max={nowISO}
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      required={showDatePicker}
                      style={{
                        width: '100%', 
                        padding: '12px', 
                        border: '2px solid #E8F5E9', 
                        borderRadius: '10px',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        backgroundColor: '#FAFAFA',
                        color: '#333',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box', // Важно: padding не раздувает input
                        maxWidth: '100%' // Страховка от переполнения
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                      onBlur={(e) => e.target.style.borderColor = '#E8F5E9'}
                    />
                    <div style={{fontSize: '0.75rem', color: '#999', marginTop: '8px', textAlign: 'right'}}>
                      * Збережеться в хронології за вказаним часом
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" disabled={isSubmitting} style={{opacity: isSubmitting ? 0.7 : 1}}>
                {isSubmitting ? 'Зберігаємо...' : 'Записати'}
              </button>
            </form>
          </div>
        </aside>

        {/* === ПРАВАЯ КОЛОНКА: ЛЕНТА === */}
        <main className="diary-feed">
          <h3 style={{marginTop: 0, marginBottom: '20px', color: '#555', borderBottom: '2px solid #e0e0e0', paddingBottom: '10px'}}>
            Хронологія
          </h3>

          {Object.keys(groupedHistory).length === 0 ? (
            <div style={{textAlign:'center', padding:'50px', background:'white', borderRadius:'15px', color:'#999'}}>
              <span style={{fontSize:'3rem'}}>📅</span>
              <p>Історія записів порожня.</p>
            </div>
          ) : (
            Object.keys(groupedHistory).map((date) => (
              <div key={date} className="timeline-day">
                <div className="day-header-sticky">
                  <span className="day-date-title">{date}</span>
                  <span style={{fontSize:'0.9rem', color:'#666', fontWeight:'600'}}>
                    Середній: <span style={{color: '#2E7D32'}}>{calculateDailyAvg(groupedHistory[date])}</span>
                  </span>
                </div>

                {groupedHistory[date].map((item) => (
                  <div key={item.id} className="timeline-entry">
                    <div className="timeline-dot"></div>
                    <button className="delete-btn" onClick={() => handleDelete(item.id)}>×</button>

                    <div style={{display:'flex', gap:'15px', alignItems:'flex-start'}}>
                      <div style={{fontSize:'2rem', lineHeight: 1}}>{getMoodEmoji(item.mood_level)}</div>
                      <div style={{width: '100%'}}>
                        <div style={{fontSize:'0.85rem', fontWeight:'bold', color:'#888', marginBottom:'5px'}}>
                          {new Date(item.date).toLocaleTimeString('uk-UA', {hour:'2-digit', minute:'2-digit'})}
                        </div>
                        <p style={{margin: '0 0 8px 0', color: '#333', whiteSpace: 'pre-wrap', lineHeight: '1.5'}}>
                          {item.text}
                        </p>
                        {item.recommendation && (
                          <div style={{background:'#FFF3E0', color:'#E65100', padding:'8px 12px', borderRadius:'8px', fontSize:'0.85rem', display:'inline-block'}}>
                            💡 {item.recommendation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </main>

      </div>
    </div>
  );
}

export default Diary;