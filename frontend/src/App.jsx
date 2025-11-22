import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StatsPage from './pages/StatsPage';
import Header from './components/Header';
import './App.css';

function App() {
  const [apiBase, setApiBase] = useState('');

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    setApiBase(base);
  }, []);

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard apiBase={apiBase} />} />
            <Route path="/stats/:code" element={<StatsPage apiBase={apiBase} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;