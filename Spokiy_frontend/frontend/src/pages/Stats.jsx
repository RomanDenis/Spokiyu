import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

// Регистрация компонентов графика
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

        // --- АГРЕГАЦИЯ ДАННЫХ ПО ДНЯМ ---
        const groups = {};
        rawData.forEach(item => {
          const date = new Date(item.date).toLocaleDateString('uk-UA');
          if (!groups[date]) groups[date] = [];
          groups[date].push(item.mood_level);
        });

        const labels = [];
        const dataPoints = [];
        
        // Сортируем даты (от старых к новым)
        const sortedDates = Object.keys(groups).reverse(); 

        sortedDates.forEach(date => {
          const levels = groups[date];
          // Считаем среднее за день
          const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
          
          labels.push(date);
          dataPoints.push(avg.toFixed(1));
        });

        // Считаем глобальное среднее (среднее из средних за дни)
        if (dataPoints.length > 0) {
            const sum = dataPoints.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
            setGlobalAvg((sum / dataPoints.length).toFixed(1));
        }

        // Настройка данных для графика
        setChartData({
          labels: labels,
          datasets: [{
            label: 'Середній настрій за день',
            data: dataPoints,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            tension: 0.3, // Плавность линий
            fill: true,
            pointRadius: 6,
            pointBackgroundColor: '#2E7D32'
          }]
        });

      } catch (error) { console.error(error); }
    };
    fetchData();
  }, [token, navigate]);

  const options = {
    responsive: true,
    scales: { y: { min: 0, max: 10 } }
  };

  return (
    <div className="container" style={{maxWidth: '900px', marginTop: '40px', paddingBottom: '50px'}}>
      <h1 style={{textAlign: 'center', color: '#2E7D32', marginBottom: '30px'}}>Аналітика 📊</h1>

      {/* Верхние карточки с цифрами */}
      <div style={{display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap'}}>
        <div className="card" style={{padding: '25px', textAlign: 'center', minWidth: '180px', flex: 1}}>
          <h3 style={{fontSize: '2.5rem', margin: '0 0 10px 0', color: '#333'}}>{totalRecs}</h3>
          <p style={{margin: 0, color: '#666'}}>Всього записів</p>
        </div>
        <div className="card" style={{padding: '25px', textAlign: 'center', minWidth: '180px', flex: 1}}>
          <h3 style={{fontSize: '2.5rem', margin: '0 0 10px 0', color: parseFloat(globalAvg) >= 5 ? '#4CAF50' : '#EF5350'}}>
            {globalAvg}/10
          </h3>
          <p style={{margin: 0, color: '#666'}}>Загальний стан</p>
        </div>
      </div>

      {/* График */}
      <div className="card" style={{padding: '20px', background: 'white', marginBottom: '30px'}}>
        {chartData ? <Line data={chartData} options={options} /> : <p style={{textAlign: 'center', color: '#888'}}>Завантаження даних...</p>}
      </div>

      {/* --- БЛОК 1: КРИТИЧЕСКОЕ СОСТОЯНИЕ (< 2.0) --- */}
      {parseFloat(globalAvg) > 0 && parseFloat(globalAvg) < 2.0 && (
        <div className="card" style={{padding: '30px', backgroundColor: '#FFEBEE', borderLeft: '6px solid #D32F2F', textAlign: 'left'}}>
            <h3 style={{color: '#D32F2F', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px'}}>
                <span>🆘</span> Критично низький рівень
            </h3>
            <p style={{color: '#333', fontSize: '1.05rem', lineHeight: '1.6'}}>
                Ваш середній показник становить <strong>{globalAvg}</strong>. Це свідчить про значний емоційний спад.
            </p>
            
            <div style={{marginTop: '25px', background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'}}>
                <h4 style={{marginTop: 0, color: '#D32F2F', fontSize: '1.2rem'}}>Екстрена допомога:</h4>
                <p style={{color: '#555', marginBottom: '15px'}}>
                    Ми радимо звернутися до спеціалістів. Ось безкоштовні номери підтримки:
                </p>
                <ul style={{listStyle: 'none', padding: 0, fontSize: '1.1rem', color: '#333'}}>
                    <li style={{marginBottom: '10px'}}>📞 <strong>7333</strong> — Гаряча лінія запобігання суїцидам</li>
                    <li style={{marginBottom: '10px'}}>📞 <strong>0 800 500 335</strong> — Лінія "Ла Страда"</li>
                    <li>🚑 <strong>103</strong> — Швидка медична допомога</li>
                </ul>
            </div>
        </div>
      )}

      {/* --- БЛОК 2: СНИЖЕНИЕ НАСТРОЕНИЯ (2.0 - 5.0) --- */}
      {parseFloat(globalAvg) >= 2.0 && parseFloat(globalAvg) < 5.0 && (
        <div className="card" style={{padding: '30px', backgroundColor: '#FFF3E0', borderLeft: '6px solid #FF9800', textAlign: 'left'}}>
            <h3 style={{color: '#E65100', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px'}}>
                <span>🧡</span> Важливо: Зниження настрою
            </h3>
            <p style={{color: '#333', fontSize: '1.05rem', lineHeight: '1.6'}}>
                Середній показник: <strong>{globalAvg}</strong>. Спробуйте приділити час собі.
            </p>
            
            <div style={{marginTop: '25px', background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'}}>
                <h4 style={{marginTop: 0, color: '#2E7D32', fontSize: '1.2rem'}}>🌱 Рекомендації:</h4>
                <ul style={{paddingLeft: '20px', color: '#555', lineHeight: '1.8', fontSize: '1rem'}}>
                    <li style={{marginBottom: '8px'}}><strong>Техніка "Заземлення":</strong> назвіть 5 речей, які бачите навколо.</li>
                    <li style={{marginBottom: '8px'}}><strong>Прогулянка:</strong> коротка прогулянка на свіжому повітрі (15 хв).</li>
                    <li><strong>Детокс:</strong> спробуйте відкласти телефон за годину до сну.</li>
                </ul>
            </div>
        </div>
      )}

    </div>
  );
}

export default Stats;