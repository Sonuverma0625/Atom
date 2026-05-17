import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Home from './components/Home';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);

  // Auto-init DB for hackathon demo
  useEffect(() => {
    axios.post('/api/init').catch(console.error);
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} onLogout={() => setUser(null)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" /> : <Login onLogin={setUser} />
          } />
          <Route path="/dashboard/*" element={
            user ? <Dashboard user={user} onLogout={() => setUser(null)} /> : <Navigate to="/" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
