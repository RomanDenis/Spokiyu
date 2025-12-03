import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Diary from './pages/Diary';
import './App.css'; // Наші глобальні стилі

function App() {
  return (
    <Router>
      <div className="app-main">
        <Navbar />
        
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/stats" element={<h2 style={{textAlign:'center'}}>Розділ статистики в розробці 📊</h2>} />
            <Route path="/profile" element={<h2 style={{textAlign:'center'}}>Особистий кабінет 👤</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;