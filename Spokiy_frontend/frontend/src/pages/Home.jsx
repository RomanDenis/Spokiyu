import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

// eslint-disable-next-line react/prop-types
function Home({ forceLanding = false }) {
  const token = localStorage.getItem('token');

  // --- СТАТИСТИКА ---
  const [weekCount, setWeekCount] = useState(0);
  const [avgMood, setAvgMood] = useState(0);
  const [lastRecord, setLastRecord] = useState(null);

  useEffect(() => {
    if (!token) return;
    axios.get('http://127.0.0.1:8000/api/mood-records/', {
      headers: { 'Authorization': `Token ${token}` }
    }).then(res => {
      const records = res.data;
      // Фильтруем записи за последние 7 дней
      const now = new Date();
      const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      const weekRecords = records.filter(r => {
        const d = new Date(r.date);
        return d >= weekAgo && d <= now;
      });
      setWeekCount(weekRecords.length);
      // Средний настрой за неделю
      if (weekRecords.length > 0) {
        const avg = weekRecords.reduce((sum, r) => sum + r.mood_level, 0) / weekRecords.length;
        setAvgMood(avg.toFixed(1));
      } else {
        setAvgMood(0);
      }
      // Последняя запись
      if (records.length > 0) {
        // Сортируем по дате
        const sorted = records.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLastRecord(sorted[0]);
      } else {
        setLastRecord(null);
      }
    });
  }, [token]);

  const showDashboard = token && !forceLanding;

  // =================================================================
  // ВАРІАНТ 1: ДАШБОРД (СТРУКТУРОВАНИЙ ВИГЛЯД)
  // =================================================================
  if (showDashboard) {
    return (
      <div className="dashboard-container">
        {/* 1. ШАПКА НА ВСЮ ШИРИНУ */}
        <header className="dashboard-header">
          <div>
            <h1>Вітаємо, <span>користувач!</span> 👋</h1>
            <p>Бажаємо гарного дня і гармонії!</p>
          </div>
          <div className="date-display">
            {new Date().toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </header>

        {/* 2. ОСНОВНА СІТКА (GRID) */}
        <div className="dashboard-grid">
          
          {/* ЛІВА КОЛОНКА (ОСНОВНА) */}
          <div className="main-column">
            
            {/* Цитата */}
            <div className="quote-block">
              <span>“Тихий розум — це сильний розум.”</span>
              <div className="quote-author">— Східна мудрість</div>
            </div>

            {/* Статистика */}
            <div className="dashboard-stats">
              <div className="stat-card blue">
                <div className="stat-icon">📅</div>
                <div className="stat-value">{weekCount} записів</div>
                <div className="stat-label">За тиждень</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-icon">😊</div>
                <div className="stat-value">{avgMood}</div>
                <div className="stat-label">Середній настрій</div>
              </div>
              <div className="stat-card green">
                <div className="stat-icon">🔒</div>
                <div className="stat-value">100%</div>
                <div className="stat-label">Приватність</div>
              </div>
            </div>

            {/* Меню швидких дій */}
            <h3 className="section-heading">Швидкі дії</h3>
            <div className="dashboard-menu">
              {/* 1. Записати */}
              <Link to="/diary" className="menu-card action-card">
                <div className="card-icon">✏️</div>
                <div className="card-info">
                  <h3>Записати думку</h3>
                  <p>Як ви почуваєтесь?</p>
                </div>
              </Link>
              
              {/* 2. Матеріали (НОВЕ) */}
              <Link to="/materials" className="menu-card green-card">
                <div className="card-icon">📚</div>
                <div className="card-info">
                  <h3>База знань</h3>
                  <p>Поради та вправи</p>
                </div>
              </Link>

              {/* 3. Статистика */}
              <Link to="/stats" className="menu-card blue-card">
                <div className="card-icon">📊</div>
                <div className="card-info">
                  <h3>Аналітика</h3>
                  <p>Графіки настрою</p>
                </div>
              </Link>

              {/* 4. Профіль */}
              <Link to="/profile" className="menu-card orange-card">
                <div className="card-icon">⚙️</div>
                <div className="card-info">
                  <h3>Налаштування</h3>
                  <p>Профіль</p>
                </div>
              </Link>
            </div>
          </div>

          {/* ПРАВА КОЛОНКА (САЙДБАР) */}
          <div className="sidebar-column">
            
            {/* Віджет: Останній запис */}
            <div className="widget-card last-record-widget">
              <h4>📝 Останній запис</h4>
              {lastRecord ? (
                <>
                  <div className="record-header">
                    <span className="mood-emoji">{lastRecord.mood_level <= 2 ? '😭' : lastRecord.mood_level <= 4 ? '😔' : lastRecord.mood_level <= 6 ? '😐' : lastRecord.mood_level <= 8 ? '🙂' : '🤩'}</span>
                    <div className="record-meta">
                      <span className="record-rating-badge">Настрій: {lastRecord.mood_level}</span>
                      <span className="record-date">{new Date(lastRecord.date).toLocaleDateString('uk-UA', {day:'numeric', month:'short'})}</span>
                    </div>
                  </div>
                  <p className="record-text">{lastRecord.text.length > 80 ? lastRecord.text.substring(0, 80) + '...' : lastRecord.text}</p>
                  <Link to="/diary" className="btn-text">Читати повністю →</Link>
                </>
              ) : (
                <div className="empty-state">
                  <p>Ще немає записів</p>
                  <Link to="/diary" className="btn-small">Створити</Link>
                </div>
              )}
            </div>

            {/* Віджет: Порада */}
            <div className="widget-card promo-widget">
              <div className="promo-icon">💡</div>
              <h4>Порада дня</h4>
              <p>Робіть глибокий вдих на 4 секунди, затримайте на 4, видих на 4. Це миттєво знижує стрес.</p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =================================================================
  // ВАРІАНТ 2: ЛЕНДИНГ
  // =================================================================
  return (
    <div className="landing-view">
      {/* Декоративная волна сверху */}
      <svg className="top-wave" viewBox="0 0 1440 120"><path fill="#388e3c" fillOpacity="0.13" d="M0,32L80,53.3C160,75,320,117,480,117.3C640,117,800,75,960,69.3C1120,64,1280,96,1360,112L1440,120L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
      
      {/* 1. HERO SECTION */}
      <section className="landing-hero">
        <div className="decor-circle circle-1"></div>
        <div className="decor-circle circle-2"></div>
        
        <div className="container hero-content">
          <h1>Знайдіть свій внутрішній <span>«Спокій»</span> 🌿</h1>
          <p>Інтелектуальна система підтримки ментального здоров'я.<br/>Використовуйте силу AI для розуміння власних емоцій та боротьби зі стресом.</p>
          
          <div className="hero-buttons">
            {token ? (
               <Link to="/" className="btn-white">Перейти в кабінет</Link>
            ) : (
              <>
                <Link to="/register" className="btn-white">Спробувати безкоштовно</Link>
                <Link to="/login" className="btn-outline">Увійти</Link>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="section-spacer"></div>

      {/* 2. STATS SECTION */}
      <section className="section-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item green">
              <h3>70%</h3>
              <p>Студентів відчувають стрес</p>
            </div>
            <div className="stat-item blue">
              <h3>24/7</h3>
              <p>Доступний самоаналіз</p>
            </div>
            <div className="stat-item orange">
              <h3>100%</h3>
              <p>Анонімність та безпека</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-spacer"></div>

      {/* 3. PROBLEM & SOLUTION */}
      <section className="section-features">
        <div className="container">
          <h2 className="section-title">Чому це важливо?</h2>
          <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontSize: '1.15rem', color: '#555', lineHeight: '1.8'}}>
            <p style={{marginBottom:'18px'}}>
              <span style={{fontSize:'1.5rem'}}>💬</span> В сучасному світі інформаційний шум та високий темп життя призводять до вигорання. Ми часто ігноруємо сигнали нашої психіки, доки не стає занадто пізно.
            </p>
            <p style={{marginTop: '20px'}}>
              <strong>«Спокій»</strong> допомагає вчасно помітити негативні тенденції. Це ваш кишеньковий психологічний помічник, який завжди вислухає.
            </p>
          </div>
        </div>
      </section>

      <div className="section-spacer"></div>

      {/* 4. AUDIENCE */}
      <section className="section-audience">
        <div className="container">
          <h2 className="section-title">Для кого цей застосунок?</h2>
          <div className="audience-grid">
            <div className="audience-card green">
              <span className="landing-icon">💻</span>
              <h3>IT-сфера</h3>
              <p>Для тих, хто працює з високим когнітивним навантаженням та дедлайнами.</p>
            </div>
            <div className="audience-card blue">
              <span className="landing-icon">🎓</span>
              <h3>Студенти</h3>
              <p>Допомога під час сесій та адаптації до навчального процесу.</p>
            </div>
            <div className="audience-card orange">
              <span className="landing-icon">🎨</span>
              <h3>Креатив</h3>
              <p>Інструмент для подолання творчих криз та пошуку ресурсу.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-spacer"></div>

      {/* 5. HOW IT WORKS */}
      <section className="section-features">
        <div className="container">
          <h2 className="section-title">Як це працює?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="landing-icon">📝</span>
              <h3>1. Запишіть</h3>
              <p>Опишіть свій стан у вільній формі. Це ваш безпечний простір.</p>
            </div>
            <div className="feature-card">
              <span className="landing-icon">🧠</span>
              <h3>2. Аналіз</h3>
              <p>NLP-алгоритми визначать емоційний тон та рівень напруги.</p>
            </div>
            <div className="feature-card">
              <span className="landing-icon">💡</span>
              <h3>3. Порада</h3>
              <p>Отримайте персональну рекомендацію або дихальну практику.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-spacer"></div>

      {/* 6. TESTIMONIALS */}
      <section className="section-testimonials">
        <div className="container">
          <h2 className="section-title">Відгуки користувачів</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p style={{fontStyle: 'italic', color: '#666'}}>&quot;Цей додаток допоміг мені пережити складну сесію. Просто записуючи думки, я відчувала полегшення.&quot;</p>
              <h4 style={{marginTop: '20px', color: '#2E7D32'}}>- Олена, студентка</h4>
            </div>
            <div className="testimonial-card">
              <p style={{fontStyle: 'italic', color: '#666'}}>&quot;Зручно слідкувати за статистикою. Я помітив, що мій настрій падає в середу, і змінив графік.&quot;</p>
              <h4 style={{marginTop: '20px', color: '#2E7D32'}}>- Максим, QA Engineer</h4>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="landing-footer">
        <div className="container footer-content">
          <div className="footer-col" style={{minWidth:'180px'}}>
            <h3>🌿 Спокій</h3>
            <p>Дипломний проєкт 2025.<br/>Вебзастосунок для підтримки ментального здоров'я.</p>
          </div>
          <div className="footer-col" style={{minWidth:'140px'}}>
            <h4>Навігація</h4>
            <div className="footer-links">
              <Link to="/about">Про проєкт</Link>
              {token ? (
                 <Link to="/">Мій кабінет</Link>
              ) : (
                <>
                  <Link to="/login">Вхід</Link>
                  <Link to="/register">Реєстрація</Link>
                </>
              )}
            </div>
          </div>
          <div className="footer-col" style={{minWidth:'140px'}}>
            <h4>Контакти</h4>
            <p>📧 support@spokiy.app</p>
            <p>📍 Київ, Україна</p>
            <p>💬 Telegram: @spokiyu</p>
          </div>
        </div>
        <div className="footer-copyright">
          © 2025 Спокій. Всі права захищені
        </div>
      </footer>
    </div>
  );
}

export default Home;