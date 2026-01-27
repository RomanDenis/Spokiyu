import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, List, ShieldAlert, Database, Trash2, Settings, Plus, Save, Download, FileText, Search, Activity
} from 'lucide-react';
import './AdminDashboard.css';

// --- MOCK DATA (Имитация данных из БД) ---
const initialDictionary = [
  { id: 1, word: 'радість', score: 0.9, type: 'positive' },
  { id: 2, word: 'тривога', score: -0.7, type: 'negative' },
  { id: 3, word: 'втома', score: -0.4, type: 'negative' },
  { id: 4, word: 'надія', score: 0.8, type: 'positive' },
];

const initialUsers = [
  { id: 1, username: 'admin', email: 'admin@spokiy.app', role: 'Адміністратор', status: 'active' },
  { id: 2, username: 'oleksii_22', email: 'alex@mail.com', role: 'Користувач', status: 'active' },
  { id: 3, username: 'maria_k', email: 'm.k@gmail.com', role: 'Користувач', status: 'blocked' },
];

const initialRecs = [
  { id: 1, title: 'Дихання 4-7-8', condition: 'Score < 0', category: 'Релаксація' },
  { id: 2, title: 'Прогулянка', condition: 'Score < 3.0', category: 'Активність' },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  
  // Локальные состояния для имитации работы БД
  const [dictionary, setDictionary] = useState(initialDictionary);
  const [users, setUsers] = useState(initialUsers);
  const [recs, setRecs] = useState(initialRecs);
  
  // Формы
  const [newWord, setNewWord] = useState('');
  const [newScore, setNewScore] = useState('');
  const [isBackupLoading, setIsBackupLoading] = useState(false);

  // Проверка прав доступа (Security Check)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    // В реальном проекте здесь будет проверка роли через API
    if (!token || username !== 'admin') {
      alert("Доступ заборонено! Ця сторінка лише для адміністраторів.");
      navigate('/');
    }
  }, [navigate]);

  // --- HANDLERS ---
  const handleAddWord = (e) => {
    e.preventDefault();
    if (!newWord || !newScore) return;
    const newItem = {
      id: Date.now(),
      word: newWord,
      score: parseFloat(newScore),
      type: parseFloat(newScore) > 0 ? 'positive' : 'negative'
    };
    setDictionary([...dictionary, newItem]);
    setNewWord('');
    setNewScore('');
  };

  const handleDeleteWord = (id) => {
    setDictionary(dictionary.filter(w => w.id !== id));
  };

  const handleBackup = () => {
    setIsBackupLoading(true);
    // Имитация задержки сервера
    setTimeout(() => {
      setIsBackupLoading(false);
      alert("Повний бекап бази даних PostgreSQL успішно створено!");
    }, 2000);
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>Панель Адміністратора 🛡️</h1>
          <p>Керування системою підтримки ментального здоров'я</p>
        </div>
        <div style={{textAlign: 'right'}}>
           <span className="badge badge-pos">System Status: Online</span>
        </div>
      </header>

      <div className="admin-grid">
        {/* === САЙДБАР === */}
        <aside className="admin-sidebar">
          <button 
            className={`admin-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} /> Користувачі
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'nlp' ? 'active' : ''}`}
            onClick={() => setActiveTab('nlp')}
          >
            <List size={20} /> Словник NLP
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'recs' ? 'active' : ''}`}
            onClick={() => setActiveTab('recs')}
          >
            <ShieldAlert size={20} /> Рекомендації
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            <Database size={20} /> Система та Логи
          </button>
        </aside>

        {/* === КОНТЕНТ === */}
        <main>
          {/* 1. КОРИСТУВАЧІ */}
          {activeTab === 'users' && (
            <div className="admin-content-card">
              <div className="card-header">
                <h3>Зареєстровані користувачі</h3>
                <div style={{display:'flex', alignItems:'center', background:'#f5f5f5', padding:'5px 10px', borderRadius:'8px'}}>
                    <Search size={16} color="#999"/>
                    <input 
                      className="input-admin"
                      style={{border:'none', background:'transparent', marginLeft:'5px'}} 
                      placeholder="Пошук..." 
                    />
                </div>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Логін</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Статус</th>
                    <th>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td><strong>{user.username}</strong></td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <span className={`badge ${user.status === 'active' ? 'badge-pos' : 'badge-neg'}`}>
                          {user.status === 'active' ? 'Активний' : 'Заблокований'}
                        </span>
                      </td>
                      <td>
                        <button className="btn-icon btn-edit"><Settings size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 2. NLP СЛОВНИК (Для диплома) */}
          {activeTab === 'nlp' && (
            <div className="admin-content-card">
              <div className="card-header">
                <h3>Словник емоційних тонів (NLP)</h3>
              </div>
              
              <div style={{background: '#e3f2fd', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: '#1565c0', fontSize:'0.9rem'}}>
                <Activity size={16} style={{verticalAlign: 'middle', marginRight:'5px'}}/>
                Цей словник використовується алгоритмом для автоматичного визначення настрою запису.
                Вага: від -1.0 (негатив) до +1.0 (позитив).
              </div>

              <form onSubmit={handleAddWord} className="add-form-inline">
                <input 
                  className="input-admin" 
                  placeholder="Нове слово (наприклад: натхнення)" 
                  value={newWord}
                  onChange={e => setNewWord(e.target.value)}
                />
                <input 
                  className="input-admin" 
                  placeholder="Вага (-1.0 ... 1.0)" 
                  type="number" step="0.1" min="-1" max="1"
                  value={newScore}
                  onChange={e => setNewScore(e.target.value)}
                />
                <button type="submit" className="btn-primary"><Plus size={18}/> Додати</button>
              </form>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Слово</th>
                    <th>Вага (Sentiment)</th>
                    <th>Тип</th>
                    <th>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {dictionary.map(item => (
                    <tr key={item.id}>
                      <td style={{fontSize: '1.05rem'}}>{item.word}</td>
                      <td><strong>{item.score}</strong></td>
                      <td>
                        <span className={`badge ${item.score > 0 ? 'badge-pos' : 'badge-neg'}`}>
                          {item.score > 0 ? 'Позитивне' : 'Негативне'}
                        </span>
                      </td>
                      <td>
                        <button className="btn-danger" onClick={() => handleDeleteWord(item.id)}>
                            <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. БАЗА РЕКОМЕНДАЦІЙ */}
          {activeTab === 'recs' && (
            <div className="admin-content-card">
              <div className="card-header">
                <h3>База автоматичних порад</h3>
                <button className="btn-primary"><Plus size={18} /> Нова порада</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Назва</th>
                    <th>Умова активації (Trigger)</th>
                    <th>Категорія</th>
                    <th>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {recs.map(rec => (
                    <tr key={rec.id}>
                      <td><strong>{rec.title}</strong></td>
                      <td style={{color: '#d32f2f', fontFamily:'monospace'}}>{rec.condition}</td>
                      <td><span className="badge badge-neut">{rec.category}</span></td>
                      <td>
                        <button className="btn-icon btn-edit"><Settings size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 4. СИСТЕМА (БЕКАПИ ТА ЛОГИ) */}
          {activeTab === 'system' && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
              <div className="admin-content-card">
                <div className="card-header">
                  <h3><Database size={22} style={{verticalAlign: 'middle', marginRight:'10px'}}/> Резервне копіювання</h3>
                </div>
                <p style={{color:'#666', marginBottom:'20px'}}>
                    Створення повного дампу бази даних PostgreSQL та файлів користувачів.
                    Рекомендується виконувати перед оновленням системи.
                </p>
                <div style={{display: 'flex', gap: '15px'}}>
                  <button className="btn-primary" onClick={handleBackup} disabled={isBackupLoading} style={{background:'#0277bd'}}>
                    {isBackupLoading ? 'Створення...' : 'Створити повний бекап'} <Save size={18} style={{marginLeft:'8px'}}/>
                  </button>
                  <button className="btn-primary" style={{background: '#f5f5f5', color:'#333', border:'1px solid #ddd'}}>
                    Завантажити лог <Download size={18} style={{marginLeft:'8px'}}/>
                  </button>
                </div>
              </div>

              <div className="admin-content-card">
                <div className="card-header">
                  <h3><FileText size={22} style={{verticalAlign: 'middle', marginRight:'10px'}}/> Журнал активності (Logs)</h3>
                </div>
                <div className="logs-container">
                  <div className="log-entry">
                      <span className="log-time">[10:00:01]</span> <span className="log-module">SYSTEM</span> Automated backup started.
                  </div>
                  <div className="log-entry">
                      <span className="log-time">[10:00:15]</span> <span className="log-module">SYSTEM</span> Backup completed successfully.
                  </div>
                  <div className="log-entry">
                      <span className="log-time">[10:45:22]</span> <span className="log-module">AUTH</span> User "admin" logged in.
                  </div>
                  <div className="log-entry">
                      <span className="log-time">[11:12:05]</span> <span className="log-module">NLP</span> Dictionary updated: added word "вигорання" (score: -0.8).
                  </div>
                  <div className="log-entry">
                      <span className="log-time">[12:30:00]</span> <span className="log-module">API</span> New MoodRecord created by user #42.
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;