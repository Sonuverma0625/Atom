import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock } from 'lucide-react';

const CheckInsTab = ({ user, goals }) => {
  const [checkIns, setCheckIns] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [quarter, setQuarter] = useState('Q1');
  const [actual, setActual] = useState('');
  const [loading, setLoading] = useState(false);
  const [managerComment, setManagerComment] = useState({});

  useEffect(() => {
    fetchCheckIns();
  }, [user]);

  const fetchCheckIns = async () => {
    try {
      const response = await axios.get(`/api/checkins/${user.id}`);
      setCheckIns(response.data);
    } catch (error) {
      console.error("Error fetching check-ins:", error);
    }
  };

  const handleSubmitCheckIn = async (e) => {
    e.preventDefault();
    if (!selectedGoal || !actual) return;
    
    setLoading(true);
    try {
      await axios.post('/api/checkins', {
        goalId: selectedGoal,
        quarter,
        actual
      });
      setActual('');
      fetchCheckIns();
    } catch (error) {
      alert(error.response?.data?.error || "Error submitting check-in");
    } finally {
      setLoading(false);
    }
  };

  const handleManagerComment = async (checkInId) => {
    const comment = managerComment[checkInId];
    if (!comment) return;

    try {
      await axios.patch(`/api/checkins/${checkInId}`, { comment });
      alert("Comment saved successfully.");
      fetchCheckIns();
    } catch (error) {
      alert("Error saving comment.");
    }
  };

  // Employees only see approved goals
  const availableGoals = goals.filter(g => g.status === 'Approved' || g.status === 'Locked');

  // Calculate Quarterly Distribution Statistics
  const q1Count = checkIns.filter(ci => ci.quarter === 'Q1').length;
  const q2Count = checkIns.filter(ci => ci.quarter === 'Q2').length;
  const q3Count = checkIns.filter(ci => ci.quarter === 'Q3').length;
  const q4Count = checkIns.filter(ci => ci.quarter === 'Q4').length;
  const annualCount = checkIns.filter(ci => ci.quarter === 'Annual').length;
  const maxCheckInCount = Math.max(q1Count, q2Count, q3Count, q4Count, annualCount, 1);

  const completedMilestones = checkIns.filter(ci => ci.actual >= ci.planned).length;
  const reviewedMilestones = checkIns.filter(ci => ci.comment).length;

  return (
    <div>
      <header style={{ marginBottom: '32px' }}>
        <h1>Quarterly Check-ins</h1>
        <p style={{ color: 'var(--text-muted)' }}>Track progress against planned targets and review historical check-ins.</p>
      </header>

      {/* Analytics Deck */}
      {checkIns.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Metrics Summary Card */}
          <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', padding: '20px 24px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Submissions</span>
              <h3 style={{ margin: '6px 0 0 0', fontSize: '1.4rem' }}>{checkIns.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Logged</span></h3>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Achieved</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--success)' }}>
                  {completedMilestones}
                </h3>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', fontWeight: 600 }}>
                  Green
                </span>
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Review Coverage</span>
              <h3 style={{ margin: '6px 0 0 0', fontSize: '1.4rem', color: 'var(--primary-color)' }}>
                {reviewedMilestones} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Audited</span>
              </h3>
            </div>
          </div>

          {/* Interactive SVG Check-in Distribution Chart */}
          <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '24px', padding: '20px 24px', alignItems: 'center' }}>
            <div style={{ display: 'grid', gap: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Submission Timeline</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Q1: <strong>{q1Count}</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-muted)' }}>Q2: <strong>{q2Count}</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-muted)' }}>Q3: <strong>{q3Count}</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-muted)' }}>Q4: <strong>{q4Count}</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-muted)' }}>Year: <strong>{annualCount}</strong></span>
              </div>
            </div>

            {/* Custom Graph Element */}
            <div style={{ width: '100%', height: '80px', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 240 80" preserveAspectRatio="none">
                {/* Background Grid Lines */}
                <line x1="20" y1="10" x2="220" y2="10" stroke="rgba(255,255,255,0.03)" strokeDasharray="2" />
                <line x1="20" y1="35" x2="220" y2="35" stroke="rgba(255,255,255,0.03)" strokeDasharray="2" />
                <line x1="20" y1="60" x2="220" y2="60" stroke="rgba(255,255,255,0.06)" />

                <defs>
                  <linearGradient id="checkinGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Bars for Q1, Q2, Q3, Q4, Annual */}
                <rect x="35" y={60 - (q1Count / maxCheckInCount) * 45} width="16" height={(q1Count / maxCheckInCount) * 45} fill="url(#checkinGrad)" rx="3" />
                <rect x="75" y={60 - (q2Count / maxCheckInCount) * 45} width="16" height={(q2Count / maxCheckInCount) * 45} fill="url(#checkinGrad)" rx="3" />
                <rect x="115" y={60 - (q3Count / maxCheckInCount) * 45} width="16" height={(q3Count / maxCheckInCount) * 45} fill="url(#checkinGrad)" rx="3" />
                <rect x="155" y={60 - (q4Count / maxCheckInCount) * 45} width="16" height={(q4Count / maxCheckInCount) * 45} fill="url(#checkinGrad)" rx="3" />
                <rect x="195" y={60 - (annualCount / maxCheckInCount) * 45} width="16" height={(annualCount / maxCheckInCount) * 45} fill="url(#checkinGrad)" rx="3" />

                {/* Vector Labels */}
                <text x="43" y="72" fill="var(--text-muted)" fontSize="6" textAnchor="middle">Q1</text>
                <text x="83" y="72" fill="var(--text-muted)" fontSize="6" textAnchor="middle">Q2</text>
                <text x="123" y="72" fill="var(--text-muted)" fontSize="6" textAnchor="middle">Q3</text>
                <text x="163" y="72" fill="var(--text-muted)" fontSize="6" textAnchor="middle">Q4</text>
                <text x="203" y="72" fill="var(--text-muted)" fontSize="6" textAnchor="middle">ANN</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {user.role !== 'MANAGER' && (
        <div className="glass-card mb-8">
          <h3>Log New Check-in</h3>
          <form onSubmit={handleSubmitCheckIn} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end', marginTop: '16px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Select Goal</label>
              {availableGoals.length === 0 ? (
                <div style={{ padding: '12px 16px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: '8px', border: '1px solid var(--warning)', fontSize: '0.9rem' }}>
                  No approved goals available. Please wait for your manager to approve your goals.
                </div>
              ) : (
                <select className="input-field" value={selectedGoal} onChange={e => setSelectedGoal(e.target.value)} required>
                  <option value="">-- Choose Approved Goal --</option>
                  {availableGoals.map(g => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Quarter</label>
              <select className="input-field" value={quarter} onChange={e => setQuarter(e.target.value)} required>
                <option value="Q1">Q1 Check-in</option>
                <option value="Q2">Q2 Check-in</option>
                <option value="Q3">Q3 Check-in</option>
                <option value="Q4">Q4 Check-in</option>
                <option value="Annual">Annual Review</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Actual Achievement</label>
              <input type="number" step="0.01" className="input-field" value={actual} onChange={e => setActual(e.target.value)} required placeholder="Value..." />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading || availableGoals.length === 0} style={{ height: '44px' }}>
              Submit
            </button>
          </form>
        </div>
      )}

      <h3>{user.role === 'MANAGER' ? "Team Check-ins" : "My Check-in History"}</h3>
      
      {checkIns.length === 0 ? (
        <div className="glass-card mt-4" style={{ textAlign: 'center', padding: '40px' }}>
          <Clock size={32} color="var(--text-muted)" style={{ margin: '0 auto', opacity: 0.5, marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>No check-ins recorded yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
          {checkIns.map(ci => {
            const progress = ci.planned > 0 ? Math.min(100, Math.round((ci.actual / ci.planned) * 100)) : 0;
            return (
              <div key={ci.id} className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    {user.role === 'MANAGER' && <p style={{ margin: 0, fontWeight: 600, color: 'var(--primary-color)' }}>{ci.goal.owner?.name}</p>}
                    <h4 style={{ margin: '4px 0' }}>{ci.goal.title}</h4>
                  </div>
                  <span className={`badge ${ci.status === 'Completed' ? 'badge-approved' : 'badge-pending'}`}>
                    {ci.quarter} - {ci.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Planned Target</span>
                    <p style={{ margin: 0, fontWeight: 600 }}>{ci.planned} {ci.goal.uom}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Actual Achievement</span>
                    <p style={{ margin: 0, fontWeight: 600, color: ci.actual >= ci.planned ? 'var(--success)' : 'var(--warning)' }}>{ci.actual} {ci.goal.uom}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progress Score</span>
                    <p style={{ margin: 0, fontWeight: 600 }}>{progress}%</p>
                  </div>
                </div>

                {ci.comment && (
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '16px', borderLeft: '4px solid var(--primary-color)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600 }}>Manager Comment:</span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem' }}>{ci.comment}</p>
                  </div>
                )}

                {user.role === 'MANAGER' && !ci.comment && (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Add review comment..." 
                      value={managerComment[ci.id] || ''}
                      onChange={e => setManagerComment({...managerComment, [ci.id]: e.target.value})}
                      style={{ flex: 1 }}
                    />
                    <button className="btn btn-secondary" onClick={() => handleManagerComment(ci.id)}>Save Comment</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CheckInsTab;
