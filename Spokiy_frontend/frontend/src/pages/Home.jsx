import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

// Мы используем параметр forceLanding для страницы "Про проект"
// eslint-disable-next-line react/prop-types
function Home({ forceLanding = false }) {
  const token = localStorage.getItem('token');

  // --- ДОБАВЛЕНО: СТАТИСТИКА ---
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

  // Логика: Показуємо Дашборд ТІЛЬКИ якщо є токен І ми НЕ в режимі "Про проєкт"
  const showDashboard = token && !forceLanding;

  // =================================================================
  // ВАРІАНТ 1: КОРИСТУВАЧ УВІЙШОВ (ПАНЕЛЬ КЕРУВАННЯ)
  // =================================================================
  if (showDashboard) {
    return (
      <div className="dashboard-container" style={{background:'linear-gradient(120deg,#e8f5e9 0%,#fff 100%)',minHeight:'100vh',paddingBottom:'40px'}}>
        {/* Хедер с приветствием и датой */}
        <header className="dashboard-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'30px',background:'#fff',borderRadius:'20px',boxShadow:'0 2px 12px rgba(67,160,71,0.07)',padding:'30px 40px'}}>
          <div>
            <h1 style={{margin:0,fontSize:'2.2rem',color:'#2E7D32',animation:'fadeInDown 1s'}}>Вітаємо, <span style={{fontWeight:'bold'}}>користувач!</span> 👋</h1>
            <p style={{margin:'8px 0 0',color:'#666',fontSize:'1.1rem'}}>Бажаємо гарного дня і гармонії!</p>
          </div>
          <div style={{fontSize:'1.1rem',color:'#43a047',fontWeight:'bold'}}>
            {new Date().toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </header>

        {/* Цитата дня */}
        <div className="quote-block" style={{background:'#e8f5e9',borderRadius:'15px',padding:'20px 30px',margin:'0 0 30px 0',boxShadow:'0 2px 8px rgba(67,160,71,0.07)',textAlign:'center',fontStyle:'italic',fontSize:'1.15rem',animation:'fadeIn 1.2s'}}>
          <span style={{fontSize:'1.5rem'}}>“Тихий розум — це сильний розум.”</span>
          <div style={{marginTop:'8px',color:'#2E7D32'}}>— Східна мудрість</div>
        </div>

        {/* Мини-статистика пользователя */}
        <div className="dashboard-stats" style={{display:'flex',gap:'30px',marginBottom:'30px',justifyContent:'center',flexWrap:'wrap'}}>
          <div style={{background:'#e3f2fd',borderRadius:'15px',padding:'20px 30px',minWidth:'180px',textAlign:'center',boxShadow:'0 2px 8px rgba(21,101,192,0.07)'}}>
            <div style={{fontSize:'2rem'}}>📅</div>
            <div style={{fontWeight:'bold',fontSize:'1.1rem'}}>{weekCount} записів за тиждень</div>
            <div style={{color:'#1565c0',fontSize:'0.95rem'}}>Активність</div>
          </div>
          <div style={{background:'#fff3e0',borderRadius:'15px',padding:'20px 30px',minWidth:'180px',textAlign:'center',boxShadow:'0 2px 8px rgba(239,108,0,0.07)'}}>
            <div style={{fontSize:'2rem'}}>😊</div>
            <div style={{fontWeight:'bold',fontSize:'1.1rem'}}>Середній настрій: {avgMood}</div>
            <div style={{color:'#ef6c00',fontSize:'0.95rem'}}>Статистика</div>
          </div>
          <div style={{background:'#e8f5e9',borderRadius:'15px',padding:'20px 30px',minWidth:'180px',textAlign:'center',boxShadow:'0 2px 8px rgba(67,160,71,0.07)'}}>
            <div style={{fontSize:'2rem'}}>🔒</div>
            <div style={{fontWeight:'bold',fontSize:'1.1rem'}}>100% приватність</div>
            <div style={{color:'#2E7D32',fontSize:'0.95rem'}}>Безпека</div>
          </div>
        </div>

        {/* Карточки быстрого доступа */}
        <div className="dashboard-menu" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'30px',marginBottom:'30px'}}>
          <Link to="/diary" className="menu-card action-card" style={{background:'#e8f5e9',borderRadius:'15px',padding:'30px',boxShadow:'0 2px 10px rgba(67,160,71,0.08)',display:'flex',alignItems:'center',gap:'20px',textDecoration:'none',color:'#333',transition:'transform 0.2s'}}>
            <div className="card-icon" style={{fontSize:'2.2rem',background:'#E8F5E9',color:'#2E7D32',padding:'15px',borderRadius:'50%'}}>✏️</div>
            <div className="card-info">
              <h3 style={{margin:'0 0 8px'}}>Записати думку</h3>
              <p style={{margin:0}}>Як ви почуваєтесь зараз?</p>
            </div>
          </Link>
          <Link to="/stats" className="menu-card" style={{background:'#e3f2fd',borderRadius:'15px',padding:'30px',boxShadow:'0 2px 10px rgba(21,101,192,0.08)',display:'flex',alignItems:'center',gap:'20px',textDecoration:'none',color:'#333',transition:'transform 0.2s'}}>
            <div className="card-icon" style={{fontSize:'2.2rem',background:'#E3F2FD',color:'#1565C0',padding:'15px',borderRadius:'50%'}}>📊</div>
            <div className="card-info">
              <h3 style={{margin:'0 0 8px'}}>Аналітика</h3>
              <p style={{margin:0}}>Переглянути графіки</p>
            </div>
          </Link>
          <Link to="/profile" className="menu-card" style={{background:'#fff3e0',borderRadius:'15px',padding:'30px',boxShadow:'0 2px 10px rgba(239,108,0,0.08)',display:'flex',alignItems:'center',gap:'20px',textDecoration:'none',color:'#333',transition:'transform 0.2s'}}>
            <div className="card-icon" style={{fontSize:'2.2rem',background:'#FFF3E0',color:'#EF6C00',padding:'15px',borderRadius:'50%'}}>⚙️</div>
            <div className="card-info">
              <h3 style={{margin:'0 0 8px'}}>Налаштування</h3>
              <p style={{margin:0}}>Профіль та акаунт</p>
            </div>
          </Link>
        </div>

        {/* Последняя запись (реальные данные) */}
        <div className="widget-card" style={{background:'#fff',borderRadius:'15px',padding:'30px',boxShadow:'0 2px 10px rgba(67,160,71,0.08)',marginBottom:'30px',maxWidth:'600px',margin:'0 auto 30px auto'}}>
          <h4 style={{marginTop:0,marginBottom:'15px',color:'#2E7D32',fontWeight:'bold'}}>Останній запис</h4>
          {lastRecord ? (
            <>
              <div style={{display:'flex',alignItems:'center',gap:'15px',marginBottom:'10px'}}>
                <span style={{fontSize:'2rem'}}>{lastRecord.mood_level <= 2 ? '😭' : lastRecord.mood_level <= 4 ? '😔' : lastRecord.mood_level <= 6 ? '😐' : lastRecord.mood_level <= 8 ? '🙂' : '🤩'}</span>
                <span style={{color:'#666'}}>{new Date(lastRecord.date).toLocaleDateString('uk-UA', {day:'numeric', month:'long'})}</span>
              </div>
              <p style={{margin:'0 0 10px 0',color:'#555'}}>{lastRecord.text.length > 60 ? lastRecord.text.substring(0, 60) + '...' : lastRecord.text}</p>
              <div style={{color:'#2E7D32',fontWeight:'bold'}}>Настрій: {lastRecord.mood_level}/10</div>
            </>
          ) : (
            <div style={{textAlign:'center',color:'#999',padding:'20px'}}>
              <p>Ще немає записів</p>
              <Link to="/diary" className="btn-small">Створити перший</Link>
            </div>
          )}
        </div>

        {/* Совет дня */}
        <div className="widget-card promo-widget" style={{background:'#e8f5e9',borderRadius:'15px',padding:'25px',boxShadow:'0 2px 8px rgba(67,160,71,0.07)',maxWidth:'600px',margin:'0 auto',textAlign:'center'}}>
          <h4 style={{marginTop:0,marginBottom:'10px'}}>💡 Порада дня</h4>
          <p style={{margin:0}}>Пам'ятайте: робити перерви — це не лінь, це відновлення ресурсу.</p>
        </div>

        {/* Простая анимация fadeInDown/fadeInUp */}
        <style>{`
          @keyframes fadeInDown {0%{opacity:0;transform:translateY(-40px);}100%{opacity:1;transform:translateY(0);}}
          @keyframes fadeInUp {0%{opacity:0;transform:translateY(40px);}100%{opacity:1;transform:translateY(0);}}
          @keyframes fadeIn {0%{opacity:0;}100%{opacity:1;}}
        `}</style>
      </div>
    );
  }

  // =================================================================
  // ВАРІАНТ 2: ЛЕНДІНГ (ДЛЯ ГОСТЕЙ АБО РЕЖИМ "ПРО ПРОЄКТ")
  // =================================================================
  return (
    <div className="landing-view" style={{background: 'linear-gradient(120deg, #e8f5e9 0%, #fff 100%)', minHeight: '100vh'}}>
      {/* Декоративная волна сверху */}
      <svg viewBox="0 0 1440 120" style={{position:'absolute',top:0,left:0,width:'100%',height:'80px',zIndex:0}}><path fill="#43a047" fillOpacity="0.18" d="M0,32L80,53.3C160,75,320,117,480,117.3C640,117,800,75,960,69.3C1120,64,1280,96,1360,112L1440,120L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
      {/* 1. HERO SECTION */}
      <section className="landing-hero" style={{position:'relative',zIndex:1}}>
        <div className="container" style={{maxWidth:'900px',margin:'0 auto'}}>
          <h1 style={{animation:'fadeInDown 1s'}}>Знайдіть свій внутрішній «Спокій» <span style={{fontSize:'2.5rem'}}>🌿</span></h1>
          <p style={{fontSize:'1.4rem',animation:'fadeIn 1.5s'}}>Інтелектуальна система підтримки ментального здоров'я.<br/>Використовуйте силу AI для розуміння власних емоцій та боротьби зі стресом.</p>
          <div className="hero-buttons" style={{marginTop:'40px'}}>
            {token ? (
               <Link to="/" className="btn-white" style={{boxShadow:'0 4px 20px rgba(67,160,71,0.12)',fontSize:'1.1rem'}}>Перейти в кабінет</Link>
            ) : (
              <>
                <Link to="/register" className="btn-white" style={{boxShadow:'0 4px 20px rgba(67,160,71,0.12)',fontSize:'1.1rem'}}>Спробувати безкоштовно</Link>
                <Link to="/login" className="btn-outline" style={{fontSize:'1.1rem'}}>Увійти</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Разделитель */}
      <div style={{width:'100%',height:'30px',background:'transparent'}}></div>

      {/* 2. STATS SECTION */}
      <section className="section-stats" style={{background:'#fff',boxShadow:'0 2px 16px rgba(67,160,71,0.07)',borderRadius:'30px',margin:'0 20px',padding:'60px 0'}}>
        <div className="container" style={{maxWidth:'900px',margin:'0 auto'}}>
          <div className="stats-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'40px'}}>
            <div className="stat-item" style={{background:'#e8f5e9',borderRadius:'20px',padding:'30px',boxShadow:'0 2px 10px rgba(67,160,71,0.08)',transition:'transform 0.2s',textAlign:'center'}}>
              <h3 style={{fontSize:'2.5rem',color:'#43a047',marginBottom:'10px'}}>70%</h3>
              <p style={{color:'#333'}}>Студентів відчувають стрес</p>
            </div>
            <div className="stat-item" style={{background:'#e3f2fd',borderRadius:'20px',padding:'30px',boxShadow:'0 2px 10px rgba(21,101,192,0.08)',transition:'transform 0.2s',textAlign:'center'}}>
              <h3 style={{fontSize:'2.5rem',color:'#1565c0',marginBottom:'10px'}}>24/7</h3>
              <p style={{color:'#333'}}>Доступний самоаналіз</p>
            </div>
            <div className="stat-item" style={{background:'#fff3e0',borderRadius:'20px',padding:'30px',boxShadow:'0 2px 10px rgba(239,108,0,0.08)',transition:'transform 0.2s',textAlign:'center'}}>
              <h3 style={{fontSize:'2.5rem',color:'#ef6c00',marginBottom:'10px'}}>100%</h3>
              <p style={{color:'#333'}}>Анонімність та безпека</p>
            </div>
          </div>
        </div>
      </section>

      {/* Разделитель */}
      <div style={{width:'100%',height:'30px',background:'transparent'}}></div>

      {/* 3. PROBLEM & SOLUTION */}
      <section className="section-features" style={{background: '#e8f5e9',borderRadius:'30px',margin:'0 20px',padding:'60px 0',boxShadow:'0 2px 16px rgba(67,160,71,0.07)'}}>
        <div className="container" style={{maxWidth:'900px',margin:'0 auto'}}>
          <h2 className="section-title" style={{marginBottom:'30px'}}>Чому це важливо?</h2>
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

      {/* Разделитель */}
      <div style={{width:'100%',height:'30px',background:'transparent'}}></div>

      {/* 4. AUDIENCE */}
      <section className="section-audience" style={{background:'#fff',borderRadius:'30px',margin:'0 20px',padding:'60px 0',boxShadow:'0 2px 16px rgba(67,160,71,0.07)'}}>
        <div className="container" style={{maxWidth:'900px',margin:'0 auto'}}>
          <h2 className="section-title" style={{marginBottom:'30px'}}>Для кого цей застосунок?</h2>
          <div className="audience-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'30px'}}>
            <div className="audience-card" style={{background:'#e8f5e9',borderRadius:'15px',padding:'25px',boxShadow:'0 2px 8px rgba(67,160,71,0.07)',transition:'transform 0.2s',textAlign:'center'}}>
              <span className="audience-icon" style={{fontSize:'2.2rem'}}>💻</span>
              <h3 style={{margin:'15px 0 10px'}}>IT-сфера</h3>
              <p>Для тих, хто працює з високим когнітивним навантаженням та дедлайнами.</p>
            </div>
            <div className="audience-card" style={{background:'#e3f2fd',borderRadius:'15px',padding:'25px',boxShadow:'0 2px 8px rgba(21,101,192,0.07)',transition:'transform 0.2s',textAlign:'center'}}>
              <span className="audience-icon" style={{fontSize:'2.2rem'}}>🎓</span>
              <h3 style={{margin:'15px 0 10px'}}>Студенти</h3>
              <p>Допомога під час сесій та адаптації до навчального процесу.</p>
            </div>
            <div className="audience-card" style={{background:'#fff3e0',borderRadius:'15px',padding:'25px',boxShadow:'0 2px 8px rgba(239,108,0,0.07)',transition:'transform 0.2s',textAlign:'center'}}>
              <span className="audience-icon" style={{fontSize:'2.2rem'}}>🎨</span>
              <h3 style={{margin:'15px 0 10px'}}>Креатив</h3>
              <p>Інструмент для подолання творчих криз та пошуку ресурсу.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Разделитель */}
      <div style={{width:'100%',height:'30px',background:'transparent'}}></div>

      {/* 5. HOW IT WORKS */}
      <section className="section-features" style={{background:'#e8f5e9',borderRadius:'30px',margin:'0 20px',padding:'60px 0',boxShadow:'0 2px 16px rgba(67,160,71,0.07)'}}>
        <div className="container" style={{maxWidth:'900px',margin:'0 auto'}}>
          <h2 className="section-title" style={{marginBottom:'30px'}}>Як це працює?</h2>
          <div className="features-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'30px'}}>
            <div className="feature-card" style={{background:'#fff',borderRadius:'15px',padding:'30px',boxShadow:'0 2px 8px rgba(67,160,71,0.07)',transition:'transform 0.2s',textAlign:'center',animation:'fadeInUp 0.8s'}}>
              <span className="feature-icon" style={{fontSize:'2.2rem'}}>📝</span>
              <h3 style={{margin:'15px 0 10px'}}>1. Запишіть</h3>
              <p>Опишіть свій стан у вільній формі. Це ваш безпечний простір.</p>
            </div>
            <div className="feature-card" style={{background:'#fff',borderRadius:'15px',padding:'30px',boxShadow:'0 2px 8px rgba(67,160,71,0.07)',transition:'transform 0.2s',textAlign:'center',animation:'fadeInUp 1.1s'}}>
              <span className="feature-icon" style={{fontSize:'2.2rem'}}>🧠</span>
              <h3 style={{margin:'15px 0 10px'}}>2. Аналіз</h3>
              <p>NLP-алгоритми визначать емоційний тон та рівень напруги.</p>
            </div>
            <div className="feature-card" style={{background:'#fff',borderRadius:'15px',padding:'30px',boxShadow:'0 2px 8px rgba(67,160,71,0.07)',transition:'transform 0.2s',textAlign:'center',animation:'fadeInUp 1.4s'}}>
              <span className="feature-icon" style={{fontSize:'2.2rem'}}>💡</span>
              <h3 style={{margin:'15px 0 10px'}}>3. Порада</h3>
              <p>Отримайте персональну рекомендацію або дихальну практику.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Разделитель */}
      <div style={{width:'100%',height:'30px',background:'transparent'}}></div>

      {/* 6. TESTIMONIALS */}
      <section className="section-stats" style={{background: 'white',boxShadow:'0 2px 16px rgba(67,160,71,0.07)',borderRadius:'30px',margin:'0 20px',padding:'60px 0'}}>
        <div className="container" style={{maxWidth:'900px',margin:'0 auto'}}>
          <h2 className="section-title" style={{marginBottom:'30px'}}>Відгуки користувачів</h2>
          <div style={{display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap'}}>
            <div style={{background: '#f9f9f9', padding: '30px', borderRadius: '15px', maxWidth: '300px',boxShadow:'0 2px 8px rgba(67,160,71,0.07)'}}>
              <p style={{fontStyle: 'italic', color: '#666'}}>
                &quot;Цей додаток допоміг мені пережити складну сесію. Просто записуючи думки, я відчувала полегшення.&quot;
              </p>
              <h4 style={{marginTop: '20px', color: '#2E7D32'}}>- Олена, студентка</h4>
            </div>
            <div style={{background: '#f9f9f9', padding: '30px', borderRadius: '15px', maxWidth: '300px',boxShadow:'0 2px 8px rgba(67,160,71,0.07)'}}>
              <p style={{fontStyle: 'italic', color: '#666'}}>
                &quot;Зручно слідкувати за статистикою. Я помітив, що мій настрій падає в середу, і змінив графік.&quot;
              </p>
              <h4 style={{marginTop: '20px', color: '#2E7D32'}}>- Максим, QA Engineer</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Разделитель */}
      <div style={{width:'100%',height:'30px',background:'transparent'}}></div>

      {/* 7. FOOTER */}
      <footer className="landing-footer" style={{background: '#263238', color: '#b0bec5', padding: '60px 0',borderRadius:'30px 30px 0 0',margin:'0 20px'}}>
        <div className="container" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', textAlign: 'left'}}>
          <div>
            <h3 style={{color: 'white', marginBottom: '20px'}}>🌿 Спокій</h3>
            <p style={{opacity: 0.8, lineHeight: '1.6'}}>
              Дипломний проєкт 2025.<br/>
              Розробка вебзастосунку для підтримки ментального здоров'я.
            </p>
          </div>
          <div>
            <h4 style={{color: 'white', marginBottom: '20px'}}>Навігація</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <Link to="/about" style={{color: '#b0bec5', textDecoration: 'none'}}>Про проєкт</Link>
              {token ? (
                 <Link to="/" style={{color: '#b0bec5', textDecoration: 'none'}}>Мій кабінет</Link>
              ) : (
                <>
                  <Link to="/login" style={{color: '#b0bec5', textDecoration: 'none'}}>Вхід</Link>
                  <Link to="/register" style={{color: '#b0bec5', textDecoration: 'none'}}>Реєстрація</Link>
                </>
              )}
            </div>
          </div>
          <div>
            <h4 style={{color: 'white', marginBottom: '20px'}}>Контакти</h4>
            <p style={{opacity: 0.8}}>📧 support@spokiy.app</p>
            <p style={{opacity: 0.8}}>📍 Київ, Україна</p>
          </div>
        </div>
        <div style={{textAlign: 'center', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #37474f', opacity: 0.6}}>
          © 2025 Всі права захищені
        </div>
      </footer>
      {/* Простая анимация fadeInDown/fadeInUp */}
      <style>{`
        @keyframes fadeInDown {0%{opacity:0;transform:translateY(-40px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes fadeInUp {0%{opacity:0;transform:translateY(40px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn {0%{opacity:0;}100%{opacity:1;}}
      `}</style>
    </div>
  );
}

export default Home;