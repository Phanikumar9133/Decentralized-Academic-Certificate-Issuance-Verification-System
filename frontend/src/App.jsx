import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import IssueCert from './pages/IssueCert';
import VerifyCert from './pages/VerifyCert';
import AllIds from './pages/AllIds';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    setIsLoggedIn(!!admin);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/issue" 
            element={isLoggedIn ? <IssueCert /> : <Navigate to="/" />} 
          />
          <Route 
            path="/verify" 
            element={<VerifyCert />} 
          />
          <Route 
            path="/all-ids" 
            element={isLoggedIn ? <AllIds /> : <Navigate to="/" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;