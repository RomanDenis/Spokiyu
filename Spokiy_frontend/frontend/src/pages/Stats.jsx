import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import './Stats.css';

// Реєстрація компонентів графіка
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

function Stats() {
  const [lineData, setLineData] = useState(null);
  const [doughnutData, setDoughnutData] = useState(null);
  const [barData, setBarData] = useState(null);
  
  const [totalRecs, setTotalRecs] = useState(0);
  const [globalAvg, setGlobalAvg] = useState(0);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }

    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/mood-records/', {
          headers: { 'Authorization': `Token ${token}` }
        });
        const rawData = response.data;
        setTotalRecs(rawData.length);

        // --- 1. ЛІНІЙНИЙ ГРАФІК ---
        const groups = {};
        rawData.forEach(item => {
          const date = new Date(item.date).toLocaleDateString('uk-UA');
          if (!groups[date]) groups[date] = [];
          groups[date].push(item.mood_level);
        });

        const sortedDates = Object.keys(groups).sort((a, b) => {
            const [d1, m1, y1] = a.split('.');
            const [d2, m2, y2] = b.split('.');
            return new Date(`${y1}-${m1}-${d1}`) - new Date(`${y2}-${m2}-${d2}`);
        });

        const lineLabels = [];
        const linePoints = [];

        sortedDates.forEach(date => {
          const levels = groups[date];
          const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
          lineLabels.push(date.slice(0, 5)); 
          linePoints.push(avg.toFixed(1));
        });

        if (linePoints.length > 0) {
            const sum = linePoints.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
            setGlobalAvg((sum / linePoints.length).toFixed(1));
        }

        setLineData({
          labels: lineLabels,
          datasets: [{
            label: 'Настрій',
            data: linePoints,
            borderColor: '#4CAF50',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, 'rgba(76, 175, 80, 0.5)');
              gradient.addColorStop(1, 'rgba(76, 175, 80, 0.0)');
              return gradient;
            },
            tension: 0.4,
            fill: true,
            pointRadius: 6,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#2E7D32',
          }]
        });

        // --- 2. КРУГОВА ДІАГРАМА ---
        let good = 0, neutral = 0, bad = 0;
        rawData.forEach(r => {
            if (r.mood_level >= 7) good++;
            else if (r.mood_level >= 4) neutral++;
            else bad++;
        });

        setDoughnutData({
            labels: ['Позитивний', 'Нейтральний', 'Негативний'],
            datasets: [{
                data: [good, neutral, bad],
                backgroundColor: ['#66BB6A', '#FFCA28', '#EF5350'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        });

        // --- 3. СТОВПЧИКИ (ТЕГИ) ---
        const tagStats = {}; 
        rawData.forEach(item => {
            const tags = item.text.match(/#[\w\u0400-\u04FF]+/g);
            if (tags) {
                tags.forEach(tag => {
                    if (!tagStats[tag]) tagStats[tag] = { sum: 0, count: 0 };
                    tagStats[tag].sum += item.mood_level;
                    tagStats[tag].count += 1;
                });
            }
        });

        const tagLabels = Object.keys(tagStats);
        const tagValues = tagLabels.map(tag => (tagStats[tag].sum / tagStats[tag].count).toFixed(1));

        if (tagLabels.length > 0) {
            setBarData({
                labels: tagLabels,
                datasets: [{
                    label: 'Середній настрій',
                    data: tagValues,
                    backgroundColor: '#42A5F5',
                    borderRadius: 8,
                }]
            });
        }

      } catch (error) { console.error(error); }
    };
    fetchData();
  }, [token, navigate]);

  const commonOptions = { responsive: true, maintainAspectRatio: false };
  const lineOptions = {
    ...commonOptions,
    plugins: { legend: { display: false } },
    scales: { y: { min: 0, max: 10 }, x: { grid: { display: false } } }
  };
  const doughnutOptions = {
    ...commonOptions,
    plugins: { legend: { position: 'right' } }
  };
  const barOptions = {
    ...commonOptions,
    plugins: { legend: { display: false } },
    scales: { y: { min: 0, max: 10 } }
  };

  const getAvgColorClass = (val) => {
      if (val >= 7) return 'good';
      if (val >= 4) return 'neutral';
      return 'bad';
  };

  return (
    <div className="stats-container">
      <h1 className="page-title">Аналітика 📊</h1>

      {/* Верхні картки */}
      <div className="stats-summary-grid">
        <div className="summary-card">
          <div className="summary-value">{totalRecs}</div>
          <p className="summary-label">Всього записів</p>
        </div>
        <div className="summary-card">
          <div className={`summary-value ${getAvgColorClass(parseFloat(globalAvg))}`}>
            {globalAvg}
          </div>
          <p className="summary-label">Середній рівень</p>
        </div>
      </div>

      {/* ОСНОВНИЙ ГРАФІК */}
      <div className="chart-card">
        <h3 className="section-heading" style={{marginBottom: '20px', textAlign: 'center'}}>Динаміка настрою</h3>
        {lineData ? (
            <div style={{ height: '300px' }}>
                <Line data={lineData} options={lineOptions} />
            </div>
        ) : <p className="loading-state">Завантаження...</p>}
      </div>

      {/* ДОДАТКОВІ ГРАФІКИ */}
      <div className="dashboard-grid" style={{marginBottom: '40px'}}>
          <div className="chart-card" style={{marginBottom: 0}}>
             <h3 className="section-heading" style={{marginBottom: '20px', textAlign: 'center', fontSize: '1.2rem'}}>Емоційний фон</h3>
             {doughnutData ? (
                 <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
                     <Doughnut data={doughnutData} options={doughnutOptions} />
                 </div>
             ) : <p className="loading-state">...</p>}
          </div>

          <div className="chart-card" style={{marginBottom: 0}}>
             <h3 className="section-heading" style={{marginBottom: '20px', textAlign: 'center', fontSize: '1.2rem'}}>Вплив тегів</h3>
             {barData ? (
                 <div style={{ height: '250px' }}>
                     <Bar data={barData} options={barOptions} />
                 </div>
             ) : (
                 <div style={{textAlign:'center', color:'#999', padding:'40px'}}>
                    <p>Додайте #теги до записів, щоб побачити статистику.</p>
                 </div>
             )}
          </div>
      </div>

      {/* --- БЛОК 1: КРИТИЧНИЙ СТАН --- */}
      {parseFloat(globalAvg) > 0 && parseFloat(globalAvg) < 3.0 && (
        <div className="alert-card critical">
            <h3 className="alert-header"><span>🆘</span> Критично низький рівень</h3>
            <p className="alert-text">Ваш середній показник <strong>{globalAvg}</strong>. Це може свідчити про емоційне вигорання.</p>
            <div className="recommendations-box">
                <h4 className="rec-title">Екстрена допомога:</h4>
                <ul className="help-list">
                    <li><span className="help-icon">📞</span> <strong>7333</strong> — Гаряча лінія</li>
                    <li><span className="help-icon">🚑</span> <strong>103</strong> — Швидка допомога</li>
                </ul>
            </div>
        </div>
      )}

      {/* --- БЛОК 2: ЗНИЖЕННЯ НАСТРОЮ (Покращений список) --- */}
      {parseFloat(globalAvg) >= 3.0 && parseFloat(globalAvg) < 5.5 && (
        <div className="alert-card warning">
            <h3 className="alert-header"><span>🧡</span> Важливо: Зниження тонусу</h3>
            <p className="alert-text">Середній показник: <strong>{globalAvg}</strong>. Схоже, ви втомилися.</p>
            
            <div className="recommendations-box">
                <h4 className="rec-title">🌱 Рекомендації для відновлення:</h4>
                {/* ОНОВЛЕНА СТРУКТУРА СПИСКУ */}
                <div className="rec-list">
                    <div className="rec-item">
                        <h5>🧘‍♂️ Техніка "Заземлення"</h5>
                        <p>Знайдіть 5 предметів синього кольору навколо себе та назвіть їх вголос. Це перемикає увагу.</p>
                    </div>
                    <div className="rec-item">
                        <h5>📵 Цифровий детокс</h5>
                        <p>Відкладіть телефон за годину до сну.Синє світло екрану заважає виробленню мелатоніну.</p>
                    </div>
                    <div className="rec-item">
                        <h5>🌲 Коротка прогулянка</h5>
                        <p>Всього 15 хвилин на свіжому повітрі здатні знизити рівень кортизолу (гормону стресу).</p>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}

export default Stats;