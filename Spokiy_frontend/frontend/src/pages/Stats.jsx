import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import './Stats.css'; // Імпорт нових стилів

// Реєстрація компонентів графіка
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function Stats() {
  const [chartData, setChartData] = useState(null);
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

        // --- АГРЕГАЦІЯ ДАНИХ ПО ДНЯХ ---
        const groups = {};
        rawData.forEach(item => {
          const date = new Date(item.date).toLocaleDateString('uk-UA');
          if (!groups[date]) groups[date] = [];
          groups[date].push(item.mood_level);
        });

        const labels = [];
        const dataPoints = [];
        
        // Сортуємо дати (від старих до нових)
        const sortedDates = Object.keys(groups).sort((a, b) => {
            const [d1, m1, y1] = a.split('.');
            const [d2, m2, y2] = b.split('.');
            return new Date(`${y1}-${m1}-${d1}`) - new Date(`${y2}-${m2}-${d2}`);
        });

        sortedDates.forEach(date => {
          const levels = groups[date];
          // Середнє за день
          const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
          
          labels.push(date.slice(0, 5)); // Показуємо тільки DD.MM для компактності
          dataPoints.push(avg.toFixed(1));
        });

        // Глобальне середнє
        if (dataPoints.length > 0) {
            const sum = dataPoints.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
            setGlobalAvg((sum / dataPoints.length).toFixed(1));
        }

        // Налаштування даних для графіка
        setChartData({
          labels: labels,
          datasets: [{
            label: 'Настрій',
            data: dataPoints,
            borderColor: '#4CAF50',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, 'rgba(76, 175, 80, 0.5)');
              gradient.addColorStop(1, 'rgba(76, 175, 80, 0.0)');
              return gradient;
            },
            tension: 0.4, // Більш плавні лінії
            fill: true,
            pointRadius: 6,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#2E7D32',
            pointBorderWidth: 2,
            pointHoverRadius: 8,
          }]
        });

      } catch (error) { console.error(error); }
    };
    fetchData();
  }, [token, navigate]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
        displayColors: false,
        callbacks: {
            label: (context) => `Настрій: ${context.parsed.y}/10`
        }
      }
    },
    scales: {
      y: { 
        min: 0, 
        max: 10,
        grid: { color: '#f0f0f0' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  // Визначення кольору середнього значення
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

      {/* Графік */}
      <div className="chart-card">
        {chartData ? (
            <div style={{ height: '350px' }}>
                <Line data={chartData} options={options} />
            </div>
        ) : (
            <p className="loading-state">Завантаження даних...</p>
        )}
      </div>

      {/* --- БЛОК 1: КРИТИЧНИЙ СТАН (< 3.0) --- */}
      {parseFloat(globalAvg) > 0 && parseFloat(globalAvg) < 3.0 && (
        <div className="alert-card critical">
            <h3 className="alert-header">
               <span>🆘</span> Критично низький рівень
            </h3>
            <p className="alert-text">
                Ваш середній показник становить <strong>{globalAvg}</strong>. Це може свідчити про емоційне вигорання або депресивний стан.
            </p>
            
            <div className="recommendations-box">
                <h4 className="rec-title">Екстрена допомога:</h4>
                <p style={{marginBottom: '15px', color: '#666'}}>Ми радимо звернутися до спеціалістів. Ось безкоштовні номери:</p>
                <ul className="help-list">
                    <li><span className="help-icon">📞</span> <strong>7333</strong> — Гаряча лінія запобігання суїцидам</li>
                    <li><span className="help-icon">📞</span> <strong>0 800 500 335</strong> — Лінія "Ла Страда"</li>
                    <li><span className="help-icon">🚑</span> <strong>103</strong> — Швидка медична допомога</li>
                </ul>
            </div>
        </div>
      )}

      {/* --- БЛОК 2: ЗНИЖЕННЯ НАСТРОЮ (3.0 - 5.5) --- */}
      {parseFloat(globalAvg) >= 3.0 && parseFloat(globalAvg) < 5.5 && (
        <div className="alert-card warning">
            <h3 className="alert-header">
                <span>🧡</span> Важливо: Зниження тонусу
            </h3>
            <p className="alert-text">
                Середній показник: <strong>{globalAvg}</strong>. Схоже, ви втомилися або переживаєте стрес. Спробуйте приділити час собі.
            </p>
            
            <div className="recommendations-box">
                <h4 className="rec-title">🌱 Рекомендації для відновлення:</h4>
                <ul className="rec-list">
                    <li><strong>Техніка "Заземлення":</strong> знайдіть 5 предметів синього кольору навколо себе.</li>
                    <li><strong>Цифровий детокс:</strong> відкладіть телефон за годину до сну.</li>
                    <li><strong>Прогулянка:</strong> 15 хвилин на свіжому повітрі значно знижують рівень кортизолу.</li>
                </ul>
            </div>
        </div>
      )}

    </div>
  );
}

export default Stats;