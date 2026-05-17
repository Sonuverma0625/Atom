import React, { useState, useEffect } from 'react';
import { Target, CheckSquare, BarChart, Users, LogOut, Plus, Check, X, Edit2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import GoalForm from './GoalForm';
import CheckInsTab from './CheckInsTab';
import ReportsTab from './ReportsTab';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    user.role === 'ADMIN' ? 'reports' : 
    user.role === 'MANAGER' ? 'team-goals' : 'my-goals'
  );
  const [goals, setGoals] = useState([]);
  const [teamGoals, setTeamGoals] = useState([]);
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
      // Clear navigation state history securely to prevent loops
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/goals/${user.id}`);
      if (user.role === 'MANAGER') {
        setTeamGoals(response.data);
        // Also fetch personal goals for manager
        const personalResponse = await axios.get(`/api/goals/${user.id}?personal=true`);
        // We need a specific personal endpoint, but for demo we will reuse it or just show team goals
      } else {
        setGoals(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch goals", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleGoalAdded = () => {
    fetchGoals();
    setIsCreatingGoal(false);
    setGoalToEdit(null);
  };

  const handleEditGoal = (goal) => {
    setGoalToEdit(goal);
    setIsCreatingGoal(true);
  };

  const handleManagerAction = async (goalId, action) => {
    try {
      const status = action === 'approve' ? 'Approved' : 'Returned for Rework';
      await axios.patch(`/api/goals/${goalId}`, { status });
      fetchGoals(); // Refresh list
    } catch (error) {
      alert("Failed to update goal");
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Approved' || status === 'Locked') return 'badge-approved';
    if (status === 'Pending Approval') return 'badge-pending';
    return 'badge-locked'; // Default fallback
  };

  const renderContent = () => {
    if (loading) return <p>Loading data...</p>;

    if (isCreatingGoal) {
      return (
        <GoalForm 
          user={user} 
          currentGoals={goals} 
          goalToEdit={goalToEdit}
          onGoalAdded={handleGoalAdded} 
          onCancel={() => { setIsCreatingGoal(false); setGoalToEdit(null); }} 
        />
      );
    }

    if (activeTab === 'my-goals') {
      const totalWeightage = goals.reduce((s, g) => s + g.weightage, 0);
      
      const getStatusBorder = (status) => {
        if (status === 'Approved' || status === 'Locked') return '4px solid var(--success)';
        if (status === 'Pending Approval') return '4px solid var(--warning)';
        return '4px solid var(--danger)';
      };

      const getStatusColor = (status) => {
        if (status === 'Approved' || status === 'Locked') return 'var(--success)';
        if (status === 'Pending Approval') return 'var(--warning)';
        return 'var(--danger)';
      };

      return (
        <>
          {/* Header Dashboard Metrics */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              <h1 style={{ marginBottom: '8px' }}>My Goal Sheet</h1>
              <p style={{ color: 'var(--text-muted)' }}>Set corporate aligned targets and track manager approval states.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setIsCreatingGoal(true)} disabled={goals.length >= 8 || totalWeightage >= 100}>
              <Plus size={18} /> Create New Goal
            </button>
          </header>

          {/* Allocation Statistics Bar */}
          <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '32px', marginBottom: '32px', padding: '20px 24px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Weightage Allocation</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: totalWeightage === 100 ? 'var(--success)' : 'var(--warning)' }}>{totalWeightage}% / 100%</h3>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: totalWeightage === 100 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: totalWeightage === 100 ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>
                  {totalWeightage === 100 ? 'Fully Allocated' : 'Incomplete'}
                </span>
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Goal Count Boundaries</span>
              <h3 style={{ margin: '6px 0 0 0', fontSize: '1.4rem' }}>{goals.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 8 goals max</span></h3>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Global Progress Meter</span>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${totalWeightage}%`, background: totalWeightage === 100 ? 'var(--success)' : 'var(--primary-color)', borderRadius: '999px', transition: 'width 0.8s ease' }}></div>
              </div>
            </div>
          </div>

          {goals.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Target size={48} color="var(--text-muted)" style={{ margin: '0 auto', opacity: 0.5 }} />
              <h4 style={{ marginTop: '16px' }}>No Goals Configured</h4>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Get started by creating your first corporate-aligned goal target.</p>
              <button className="btn btn-primary" onClick={() => setIsCreatingGoal(true)}>Create Goal</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {goals.map(goal => (
                <div key={goal.id} className="glass-card" style={{ borderLeft: getStatusBorder(goal.status), display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
                  
                  {/* Header Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{goal.title}</h3>
                        
                        {/* Status Label with Pulsing Dot */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(goal.status), boxShadow: `0 0 8px ${getStatusColor(goal.status)}` }}></span>
                          <span style={{ color: getStatusColor(goal.status) }}>{goal.status}</span>
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '800px', margin: 0 }}>
                        {goal.description}
                      </p>
                    </div>

                    {/* Rework Button */}
                    {goal.status === 'Returned for Rework' && (
                      <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', gap: '6px' }} onClick={() => handleEditGoal(goal)}>
                        <Edit2 size={12} /> Revise Goal
                      </button>
                    )}
                  </div>

                  {/* Rework Notice Panel */}
                  {goal.status === 'Returned for Rework' && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '12px 16px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '1rem' }}>⚠️</span>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#fca5a5', lineHeight: '1.4' }}>
                        <strong>Revisions Required:</strong> Your manager returned this goal. Click the "Revise Goal" button above to adjust your metrics and resubmit.
                      </p>
                    </div>
                  )}

                  {/* Structured KPI Specs Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '16px 20px', borderRadius: '12px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ padding: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', color: 'var(--text-muted)' }}>
                        <Target size={16} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Target Metric</span>
                        <strong>{goal.target} {goal.uom}</strong>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Weightage Allocation ({goal.weightage}%)</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${goal.weightage}%`, background: 'var(--primary-color)', borderRadius: '999px' }}></div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Registered</span>
                        <strong>{new Date(goal.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </>
      );
    }

    if (activeTab === 'team-goals' && user.role === 'MANAGER') {
      const getStatusBorder = (status) => {
        if (status === 'Approved' || status === 'Locked') return '4px solid var(--success)';
        if (status === 'Pending Approval') return '4px solid var(--warning)';
        return '4px solid var(--danger)';
      };

      const getStatusColor = (status) => {
        if (status === 'Approved' || status === 'Locked') return 'var(--success)';
        if (status === 'Pending Approval') return 'var(--warning)';
        return 'var(--danger)';
      };

      const pendingCount = teamGoals.filter(g => g.status === 'Pending Approval').length;
      const approvedCount = teamGoals.filter(g => g.status === 'Approved' || g.status === 'Locked').length;
      const reworkCount = teamGoals.filter(g => g.status === 'Returned for Rework').length;
      const maxCount = Math.max(pendingCount, approvedCount, reworkCount, 1);

      return (
        <>
          {/* Header Description */}
          <header style={{ marginBottom: '32px' }}>
            <h1>Team Goals Review</h1>
            <p style={{ color: 'var(--text-muted)' }}>Review, audit, and approve strategic target sheets submitted by your direct reports.</p>
          </header>

          {/* Manager Overview Dashboard Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '24px', padding: '20px 24px', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Audits</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', color: pendingCount > 0 ? 'var(--warning)' : 'var(--success)' }}>
                    {pendingCount} Goals
                  </h3>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: pendingCount > 0 ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', color: pendingCount > 0 ? 'var(--warning)' : 'var(--success)', fontWeight: 600 }}>
                    {pendingCount > 0 ? 'Action Required' : 'All Clear'}
                  </span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Team Goals</span>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '1.4rem' }}>{teamGoals.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Registered</span></h3>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Approved Scope</span>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '1.4rem', color: 'var(--success)' }}>
                  {approvedCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Locked</span>
                </h3>
              </div>
            </div>

            {/* Glowing SVG Bar Chart Panel */}
            <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '24px', padding: '20px 24px', alignItems: 'center', height: '100%' }}>
              <div style={{ display: 'grid', gap: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Goal Distribution</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--warning)' }}></span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pending: <strong>{pendingCount}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--success)' }}></span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Approved: <strong>{approvedCount}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--danger)' }}></span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Rework: <strong>{reworkCount}</strong></span>
                </div>
              </div>

              {/* Responsive Custom Graph Canvas */}
              <div style={{ width: '100%', height: '80px', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="20" y1="10" x2="180" y2="10" stroke="rgba(255,255,255,0.03)" strokeDasharray="2" />
                  <line x1="20" y1="35" x2="180" y2="35" stroke="rgba(255,255,255,0.03)" strokeDasharray="2" />
                  <line x1="20" y1="60" x2="180" y2="60" stroke="rgba(255,255,255,0.06)" />

                  <defs>
                    <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--warning)" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="var(--warning)" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--success)" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="var(--success)" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--danger)" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="var(--danger)" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* SVG Bar 1: Pending */}
                  <rect 
                    x="40" 
                    y={60 - (pendingCount / maxCount) * 45} 
                    width="22" 
                    height={(pendingCount / maxCount) * 45} 
                    fill="url(#pGrad)" 
                    rx="3"
                  />
                  {/* SVG Bar 2: Approved */}
                  <rect 
                    x="90" 
                    y={60 - (approvedCount / maxCount) * 45} 
                    width="22" 
                    height={(approvedCount / maxCount) * 45} 
                    fill="url(#aGrad)" 
                    rx="3"
                  />
                  {/* SVG Bar 3: Rework */}
                  <rect 
                    x="140" 
                    y={60 - (reworkCount / maxCount) * 45} 
                    width="22" 
                    height={(reworkCount / maxCount) * 45} 
                    fill="url(#rGrad)" 
                    rx="3"
                  />

                  {/* Tiny label texts */}
                  <text x="51" y="70" fill="var(--text-muted)" fontSize="6" textAnchor="middle">PND</text>
                  <text x="101" y="70" fill="var(--text-muted)" fontSize="6" textAnchor="middle">APP</text>
                  <text x="151" y="70" fill="var(--text-muted)" fontSize="6" textAnchor="middle">RWK</text>
                </svg>
              </div>
            </div>
          </div>

          {teamGoals.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--text-muted)' }}>No team goals to review currently.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {teamGoals.map(goal => (
                <div key={goal.id} className="glass-card" style={{ borderLeft: getStatusBorder(goal.status), display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
                  
                  {/* Employee Info Header Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Circle Employee Avatar */}
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                        {goal.owner?.name ? goal.owner.name.charAt(0) : 'E'}
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Direct Report</span>
                        <strong style={{ fontSize: '0.95rem' }}>{goal.owner?.name}</strong>
                      </div>
                    </div>

                    {/* Status badge with pulsing dot */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(goal.status), boxShadow: `0 0 8px ${getStatusColor(goal.status)}` }}></span>
                      <span style={{ color: getStatusColor(goal.status) }}>{goal.status}</span>
                    </div>
                  </div>

                  {/* Goal title and description */}
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>{goal.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>{goal.description}</p>
                  </div>

                  {/* Structured KPI Specs Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '16px 20px', borderRadius: '12px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ padding: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', color: 'var(--text-muted)' }}>
                        <Target size={16} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Target Metric</span>
                        <strong>{goal.target} {goal.uom}</strong>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Weightage Allocation ({goal.weightage}%)</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${goal.weightage}%`, background: 'var(--primary-color)', borderRadius: '999px' }}></div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Submitted</span>
                        <strong>{new Date(goal.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Approval Actions Panel */}
                  {goal.status === 'Pending Approval' && (
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                      <button className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '0.85rem', color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.04)' }} onClick={() => handleManagerAction(goal.id, 'rework')}>
                        <X size={14} /> Return for Rework
                      </button>
                      <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem', background: 'var(--success)', border: 'none', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }} onClick={() => handleManagerAction(goal.id, 'approve')}>
                        <Check size={14} /> Approve Goal
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </>
      );
    }

    if (activeTab === 'check-ins') {
      return <CheckInsTab user={user} goals={goals} />;
    }

    if (activeTab === 'reports') {
      return <ReportsTab />;
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav className="sidebar-nav" style={{ marginTop: '0' }}>
          {user.role === 'EMPLOYEE' && (
            <>
              <a href="#" className={`nav-item ${activeTab === 'my-goals' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('my-goals'); setIsCreatingGoal(false); }}>
                <Target size={20} />
                My Goals
              </a>
              <a href="#" className={`nav-item ${activeTab === 'check-ins' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('check-ins'); setIsCreatingGoal(false); }}>
                <CheckSquare size={20} />
                Quarterly Check-ins
              </a>
            </>
          )}
          {user.role === 'MANAGER' && (
            <>
              <a href="#" className={`nav-item ${activeTab === 'team-goals' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('team-goals'); setIsCreatingGoal(false); }}>
                <Users size={20} />
                Team Goals
              </a>
              <a href="#" className={`nav-item ${activeTab === 'check-ins' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('check-ins'); setIsCreatingGoal(false); }}>
                <CheckSquare size={20} />
                Quarterly Check-ins
              </a>
              <a href="#" className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('reports'); setIsCreatingGoal(false); }}>
                <BarChart size={20} />
                System Reports
              </a>
            </>
          )}
          {user.role === 'ADMIN' && (
            <a href="#" className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('reports'); setIsCreatingGoal(false); }}>
              <BarChart size={20} />
              System Reports
            </a>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
