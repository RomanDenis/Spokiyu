import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const token = localStorage.getItem('token');

  // =================================================================
  // ВАРІАНТ 1: КОРИСТУВАЧ УВІЙШОВ (ПАНЕЛЬ КЕРУВАННЯ / DASHBOARD)
  // =================================================================
  if (token) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-welcome">
          <h1>З поверненням! 👋</h1>
          <p>Ваш персональний простір емоційної рівноваги готовий до роботи.</p>
        </div>

        <div className="dashboard-menu">
          {/* Картка 1: Щоденник */}
          <Link to="/diary" className="menu-card">
            <div className="card-icon">📝</div>
            <div className="card-info">
              <h3>Мій Щоденник</h3>
              <p>Записати думки та отримати пораду</p>
            </div>
          </Link>

          {/* Картка 2: Статистика */}
          <Link to="/stats" className="menu-card">
            <div className="card-icon">📊</div>
            <div className="card-info">
              <h3>Статистика</h3>
              <p>Аналіз динаміки настрою</p>
            </div>
          </Link>

          {/* Картка 3: Профіль */}
          <Link to="/profile" className="menu-card">
            <div className="card-icon">👤</div>
            <div className="card-info">
              <h3>Мій Профіль</h3>
              <p>Налаштування акаунту</p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // =================================================================
  // ВАРІАНТ 2: ГІСТЬ (ЛЕНДІНГ НА ВСЮ ШИРИНУ)
  // =================================================================
  return (
    <div className="landing-view">
      
      {/* 1. HERO SECTION (Зелений градієнт на всю ширину) */}
      <section className="landing-hero">
        <div className="container">
          <h1>Знайдіть свій внутрішній «Спокій»</h1>
          <p>
            Інтелектуальна система підтримки ментального здоров'я. 
            Використовуйте силу AI для розуміння власних емоцій та боротьби зі стресом.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-white">Спробувати безкоштовно</Link>
            <Link to="/login" className="btn-outline">Увійти</Link>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION (Білий фон) */}
      <section className="section-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>70%</h3>
              <p>Студентів відчувають стрес</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Доступний самоаналіз</p>
            </div>
            <div className="stat-item">
              <h3>100%</h3>
              <p>Анонімність та безпека</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM & SOLUTION (Світло-зелений фон) */}
      <section className="section-features" style={{background: '#e8f5e9'}}>
        <div className="container">
          <h2 className="section-title">Чому це важливо?</h2>
          <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontSize: '1.1rem', color: '#555', lineHeight: '1.8'}}>
            <p>
              В сучасному світі інформаційний шум та високий темп життя призводять до вигорання. 
              Ми часто ігноруємо сигнали нашої психіки, доки не стає занадто пізно.
            </p>
            <p style={{marginTop: '20px'}}>
              <strong>«Спокій»</strong> допомагає вчасно помітити негативні тенденції. 
              Це ваш кишеньковий психологічний помічник, який завжди вислухає.
            </p>
          </div>
        </div>
      </section>

      {/* 4. AUDIENCE (Білий фон) */}
      <section className="section-audience">
        <div className="container">
          <h2 className="section-title">Для кого цей застосунок?</h2>
          <div className="audience-grid">
            <div className="audience-card">
              <span className="audience-icon">💻</span>
              <h3>IT-сфера</h3>
              <p>Для тих, хто працює з високим когнітивним навантаженням та дедлайнами.</p>
            </div>
            <div className="audience-card">
              <span className="audience-icon">🎓</span>
              <h3>Студенти</h3>
              <p>Допомога під час сесій та адаптації до навчального процесу.</p>
            </div>
            <div className="audience-card">
              <span className="audience-icon">🎨</span>
              <h3>Креатив</h3>
              <p>Інструмент для подолання творчих криз та пошуку ресурсу.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (Світло-зелений фон) */}
      <section className="section-features">
        <div className="container">
          <h2 className="section-title">Як це працює?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">📝</span>
              <h3>1. Запишіть</h3>
              <p>Опишіть свій стан у вільній формі. Це ваш безпечний простір.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🧠</span>
              <h3>2. Аналіз</h3>
              <p>NLP-алгоритми визначать емоційний тон та рівень напруги.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💡</span>
              <h3>3. Порада</h3>
              <p>Отримайте персональну рекомендацію або дихальну практику.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS (Білий фон) - НОВЕ */}
      <section className="section-stats" style={{background: 'white'}}>
        <div className="container">
          <h2 className="section-title">Відгуки користувачів</h2>
          <div style={{display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap'}}>
            <div style={{background: '#f9f9f9', padding: '30px', borderRadius: '15px', maxWidth: '300px'}}>
              <p style={{fontStyle: 'italic', color: '#666'}}>
                "Цей додаток допоміг мені пережити складну сесію. Просто записуючи думки, я відчувала полегшення."
              </p>
              <h4 style={{marginTop: '20px', color: '#2E7D32'}}>- Олена, студентка</h4>
            </div>
            <div style={{background: '#f9f9f9', padding: '30px', borderRadius: '15px', maxWidth: '300px'}}>
              <p style={{fontStyle: 'italic', color: '#666'}}>
                "Зручно слідкувати за статистикою. Я помітив, що мій настрій падає в середу, і змінив графік."
              </p>
              <h4 style={{marginTop: '20px', color: '#2E7D32'}}>- Максим, QA Engineer</h4>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER (Темний фон на всю ширину) */}
      <footer className="landing-footer" style={{background: '#263238', color: '#b0bec5', padding: '60px 0'}}>
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
              <Link to="/login" style={{color: '#b0bec5', textDecoration: 'none'}}>Вхід</Link>
              <Link to="/register" style={{color: '#b0bec5', textDecoration: 'none'}}>Реєстрація</Link>
              <Link to="/" style={{color: '#b0bec5', textDecoration: 'none'}}>Про проєкт</Link>
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

    </div>
  );
}

export default Home;