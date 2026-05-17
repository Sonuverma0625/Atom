import React, { useState } from 'react';
import { Target, User, LogOut, Bell, Home, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const notifications = [
    { id: 1, type: 'goal', text: 'Goal Approved: "20000" approved by Manager.', time: '2 hours ago', icon: <CheckCircle2 size={14} color="var(--success)" />, tab: 'my-goals' },
    { id: 2, type: 'checkin', text: 'Q1 Check-in registered successfully.', time: '4 hours ago', icon: <CheckCircle2 size={14} color="var(--primary-color)" />, tab: 'check-ins' },
    { id: 3, type: 'system', text: 'Welcome to AtomQuest Hackathon Portal!', time: '1 day ago', icon: <AlertCircle size={14} color="var(--warning)" />, tab: 'reports' }
  ];

  const handleNotificationClick = (n) => {
    if (!user) return; // But not without login
    
    setShowNotifications(false);
    
    let tab = n.tab;
    // Dynamic access check
    if (tab === 'reports' && user.role === 'EMPLOYEE') {
      tab = 'my-goals';
    } else if (tab === 'my-goals' && user.role === 'ADMIN') {
      tab = 'reports';
    }
    
    navigate('/dashboard', { state: { tab } });
  };

  return (
    <nav className="top-navbar glass-card">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <div className="logo-icon">
            <Target color="white" size={20} />
          </div>
          <span className="logo-text">AtomQuest</span>
        </div>

        <div className="navbar-links">
          <button className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>
            <Home size={16} /> Home
          </button>
          <button className="nav-link" onClick={() => { navigate('/'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>
            <Info size={16} /> About
          </button>
          <button className="nav-link" onClick={() => { navigate('/'); setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>
            <Target size={16} /> Portal Info
          </button>
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <div style={{ position: 'relative' }}>
                <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                  <Bell size={20} />
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%' }}></span>
                </button>
                
                {showNotifications && (
                  <div className="glass-card" style={{ position: 'absolute', top: '45px', right: 0, width: '280px', padding: '16px', zIndex: 1000, boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Notifications</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', cursor: 'pointer' }} onClick={() => setShowNotifications(false)}>Close</span>
                    </div>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => handleNotificationClick(n)}
                          className="notification-item"
                          style={{ 
                            display: 'flex', 
                            gap: '8px', 
                            alignItems: 'flex-start', 
                            padding: '10px 8px', 
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background 0.2s ease',
                            borderBottom: n.id !== 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' 
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ marginTop: '2px' }}>{n.icon}</div>
                          <div>
                            <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: '1.2' }}>{n.text}</p>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="user-menu" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setShowProfile(!showProfile)}>
                  <div className="user-avatar" style={{ background: 'var(--primary-color)', color: '#fff', boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)' }}>
                    <User size={18} />
                  </div>
                  <div className="user-info-nav">
                    <span className="user-name-nav">{user.name}</span>
                    <span className="user-role-nav">{user.role}</span>
                  </div>
                </div>
                <button className="btn-logout" onClick={handleLogout} style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '12px', marginLeft: '12px' }}>
                  <LogOut size={16} />
                </button>
                
                {showProfile && (
                  <div className="glass-card" style={{ position: 'absolute', top: '50px', right: 0, width: '300px', padding: '24px', zIndex: 1000, boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)', border: '1px solid rgba(255, 255, 255, 0.12)', background: 'rgba(30, 41, 59, 0.95)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Security Profile</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 500 }} onClick={() => setShowProfile(false)}>Close</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '20px', textAlign: 'center' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)', fontSize: '1.5rem', fontWeight: 700 }}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{user.name}</h3>
                        <span className="badge badge-locked" style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.75rem', padding: '4px 12px' }}>{user.role}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gap: '12px', fontSize: '0.82rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Corporate ID:</span>
                        <strong style={{ fontFamily: 'monospace' }}>ATOM-2026-0{user.id}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Secure Email:</span>
                        <strong>{user.email}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>● Active & Compliant</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary" style={{ padding: '8px 16px' }} onClick={() => alert('Sign up is currently disabled for this hackathon demo. Please use the provided demo accounts in the Login screen.')}>Sign Up</button>
              <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={() => navigate('/login')}>Login</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
