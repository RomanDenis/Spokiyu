import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container" style={{textAlign: 'center', padding: '20px'}}>
      
      {/* Hero Section */}
      <div style={{marginBottom: '50px'}}>
        <h1 style={{fontSize: '2.5rem', color: '#2E7D32'}}>Знайдіть свій внутрішній спокій</h1>
        <p style={{fontSize: '1.2rem', color: '#555', maxWidth: '600px', margin: '0 auto 30px'}}>
          Сучасний інструмент для турботи про ментальне здоров'я. 
          Фіксуйте настрій, аналізуйте емоції та отримуйте персональні поради.
        </p>
        <Link to="/diary">
          <button style={{width: '200px', fontSize: '1.1rem'}}>Розпочати щоденник</button>
        </Link>
      </div>

      {/* Features Section (з вимог звіту) */}
      <div style={{display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap'}}>
        
        <div className="feature-card" style={cardStyle}>
          <h3>📝 Моніторинг</h3>
          <p>Швидка фіксація емоційного стану та ведення історії.</p>
        </div>

        <div className="feature-card" style={cardStyle}>
          <h3>🧠 AI Аналіз</h3>
          <p>Автоматичне визначення тональності ваших записів.</p>
        </div>

        <div className="feature-card" style={cardStyle}>
          <h3>💡 Рекомендації</h3>
          <p>Персональні поради для покращення самопочуття.</p>
        </div>

      </div>
    </div>
  );
}

const cardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '12px',
  width: '250px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
};

export default Home;