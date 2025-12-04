import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useNavigate, Link } from 'react-router-dom';

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
        const sortedDates = Object.keys(groups).reverse(); 

        sortedDates.forEach(date => {
          const levels = groups[date];
          const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
          
          labels.push(date);
          dataPoints.push(avg.toFixed(1));
        });

        // Рахуємо глобальне середнє
        if (dataPoints.length > 0) {
            const sum = dataPoints.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
            setGlobalAvg((sum / dataPoints.length).toFixed(1));
        }

        setChartData({
          labels: labels,
          datasets: [{
            label: 'Середній настрій за день',
            data: dataPoints,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            tension: 0.3,
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

      {/* Верхні картки */}
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

      {/* Графік */}
      <div className="card" style={{padding: '20px', background: 'white', marginBottom: '30px'}}>
        {chartData ? <Line data={chartData} options={options} /> : <p style={{textAlign: 'center', color: '#888'}}>Завантаження даних...</p>}
      </div>

      {/* --- БЛОК 1: КРИТИЧНИЙ СТАН (< 2.0) --- */}
      {parseFloat(globalAvg) > 0 && parseFloat(globalAvg) < 2.0 && (
        <div className="card" style={{padding: '30px', backgroundColor: '#FFEBEE', borderLeft: '6px solid #D32F2F', textAlign: 'left'}}>
            <h3 style={{color: '#D32F2F', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px'}}>
                <span>🆘</span> Увага: Критично низький рівень
            </h3>
            <p style={{color: '#333', fontSize: '1.05rem', lineHeight: '1.6'}}>
                Ваш середній показник становить <strong>{globalAvg}</strong>. Це свідчить про значний емоційний спад. 
                Будь ласка, не ігноруйте цей стан.
            </p>
            
            <div style={{marginTop: '25px', background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'}}>
                <h4 style={{marginTop: 0, color: '#D32F2F', fontSize: '1.2rem'}}>Ми наполегливо рекомендуємо:</h4>
                <p style={{color: '#555', marginBottom: '20px'}}>
                    Найкращим рішенням у цій ситуації буде звернутися за професійною допомогою. 
                    Фахівець допоможе розібратися з причинами та знайти вихід.
                </p>
                
                <Link to="/profile" style={{
                    display: 'inline-block', 
                    backgroundColor: '#D32F2F', 
                    color: 'white', 
                    padding: '12px 25px', 
                    borderRadius: '10px', 
                    textDecoration: 'none', 
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(211, 47, 47, 0.3)'
                }}>
                    Записатися до спеціаліста зараз →
                </Link>
            </div>
        </div>
      )}

      {/* --- БЛОК 2: ЗНИЖЕННЯ НАСТРОЮ (від 2.0 до 5.0) --- */}
      {parseFloat(globalAvg) >= 2.0 && parseFloat(globalAvg) < 5.0 && (
        <div className="card" style={{padding: '30px', backgroundColor: '#FFF3E0', borderLeft: '6px solid #FF9800', textAlign: 'left'}}>
            <h3 style={{color: '#E65100', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px'}}>
                <span>🧡</span> Важливо: Ми помітили зниження настрою
            </h3>
            <p style={{color: '#333', fontSize: '1.05rem', lineHeight: '1.6'}}>
                Останнім часом ваш середній показник становить <strong>{globalAvg}</strong>. 
                Це абсолютно нормально — мати складні періоди, але важливо вчасно про себе подбати.
            </p>
            
            <div style={{marginTop: '25px', background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'}}>
                <h4 style={{marginTop: 0, color: '#2E7D32', fontSize: '1.2rem'}}>🌱 Рекомендації для відновлення:</h4>
                <ul style={{paddingLeft: '20px', color: '#555', lineHeight: '1.8', fontSize: '1rem'}}>
                    <li style={{marginBottom: '10px'}}>
                        <strong>Техніка "Заземлення":</strong> Назвіть 5 речей, які ви бачите, 4, які можете торкнутися, 3, які чуєте, 2, які відчуваєте на запах, і 1 річ, яка вам подобається в собі.
                    </li>
                    <li style={{marginBottom: '10px'}}>
                        <strong>Фізична активність:</strong> Навіть 15 хвилин прогулянки на свіжому повітрі можуть знизити рівень кортизолу (гормону стресу).
                    </li>
                    <li style={{marginBottom: '10px'}}>
                        <strong>Інформаційний детокс:</strong> Спробуйте відкласти телефон за годину до сну.
                    </li>
                    <li>
                        <strong>Професійна підтримка:</strong> Ви можете записатися на консультацію до фахівця прямо у своєму кабінеті.
                        <br/>
                        <Link to="/profile" style={{display: 'inline-block', marginTop: '10px', color: '#E65100', fontWeight: 'bold', textDecoration: 'none', borderBottom: '2px solid #E65100'}}>
                            Перейти до запису →
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
      )}

    </div>
  );
}

export default Stats;