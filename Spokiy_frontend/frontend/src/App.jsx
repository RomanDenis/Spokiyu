import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Diary from './pages/Diary';
import Login from './pages/Login';       // <--- Додали
import Register from './pages/Register'; // <--- Додали
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-main">
        <Navbar />
        
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/login" element={<Login />} />       {/* <--- Додали */}
            <Route path="/register" element={<Register />} /> {/* <--- Додали */}
            <Route path="/stats" element={<h2 style={{textAlign:'center'}}>Статистика (Скоро)</h2>} />
            <Route path="/profile" element={<h2 style={{textAlign:'center'}}>Кабінет (Скоро)</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;