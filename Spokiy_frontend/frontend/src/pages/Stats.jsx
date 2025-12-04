import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

// Реєструємо компоненти графіка (обов'язково для Chart.js)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Stats() {
  const [history, setHistory] = useState([]);
  const [averageMood, setAverageMood] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/mood-records/', {
          headers: { 'Authorization': `Token ${token}` }
        });
        
        const data = response.data;
        
        // API віддає від нових до старих. Для графіка треба навпаки (зліва направо).
        // Робимо копію і розвертаємо
        const sortedData = [...data].reverse();
        setHistory(sortedData);

        // Рахуємо середній настрій
        if (data.length > 0) {
          const sum = data.reduce((acc, curr) => acc + curr.mood_level, 0);
          setAverageMood((sum / data.length).toFixed(1));
        }

      } catch (error) {
        console.error("Помилка завантаження", error);
      }
    };

    fetchData();
  }, [token, navigate]);

  // --- НАЛАШТУВАННЯ ГРАФІКА ---
  const chartData = {
    // Осі X (Дати)
    labels: history.map(item => new Date(item.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })),
    datasets: [
      {
        label: 'Рівень настрою',
        data: history.map(item => item.mood_level), // Осі Y (Настрій)
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)', // Зелена заливка знизу
        tension: 0.4, // Плавність ліній (крива Безьє)
        fill: true,
        pointBackgroundColor: '#2E7D32',
        pointRadius: 5
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Динаміка емоційного стану' },
    },
    scales: {
      y: {
        min: 0,
        max: 10, // Шкала від 0 до 10
        title: { display: true, text: 'Настрій (1-10)' }
      }
    }
  };

  return (
    <div className="container" style={{maxWidth: '900px', marginTop: '40px'}}>
      <h1 style={{textAlign: 'center', color: '#2E7D32'}}>Ваша Статистика 📊</h1>

      {/* Картки з цифрами */}
      <div style={{display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap'}}>
        <div style={statCardStyle}>
          <h3>{history.length}</h3>
          <p>Всього записів</p>
        </div>
        <div style={statCardStyle}>
          <h3 style={{color: averageMood >= 5 ? '#4CAF50' : '#ef5350'}}>{averageMood}/10</h3>
          <p>Середній настрій</p>
        </div>
      </div>

      {/* Графік */}
      <div className="card" style={{padding: '20px', background: 'white', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'}}>
        {history.length > 1 ? (
          <Line data={chartData} options={options} />
        ) : (
          <p style={{textAlign: 'center', padding: '40px', color: '#888'}}>
            Потрібно мінімум 2 записи, щоб побудувати графік. <br/>
            Перейдіть у <a href="/diary" style={{color: '#4CAF50'}}>Щоденник</a> і додайте ще один запис!
          </p>
        )}
      </div>
    </div>
  );
}

// Простий стиль для карток з цифрами
const statCardStyle = {
  background: 'white',
  padding: '20px 40px',
  borderRadius: '15px',
  textAlign: 'center',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  minWidth: '150px'
};

export default Stats;