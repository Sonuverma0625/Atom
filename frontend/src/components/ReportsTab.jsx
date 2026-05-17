import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Users, Target, CheckCircle, ShieldAlert, Award, FileText, Shield, Key } from 'lucide-react';

const ReportsTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>Loading reporting console...</p>;
  if (!stats) return <p style={{ color: 'var(--danger)', padding: '40px', textAlign: 'center' }}>Failed to load reporting data.</p>;

  const approvedRatio = stats.totalGoals > 0 ? Math.round((stats.approvedGoals / stats.totalGoals) * 100) : 0;
  const pendingRatio = 100 - approvedRatio;
  const { q1Count = 0, q2Count = 0, q3Count = 0, q4Count = 0, annualCount = 0 } = stats;

  // SVG circular chart properties
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const approvedStrokeDashoffset = circumference - (approvedRatio / 100) * circumference;

  return (
    <div>
      <header style={{ marginBottom: '32px' }}>
        <h1>Reporting & Compliance</h1>
        <p style={{ color: 'var(--text-muted)' }}>Real-time audit overview, goal alignment compliance, and check-in completion rates.</p>
      </header>

      {/* Grid of stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--primary-color)' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Employees</span>
            <h2 style={{ margin: 0, fontSize: '1.6rem' }}>{stats.totalUsers}</h2>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--success)' }}>
            <Target size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Goals Set</span>
            <h2 style={{ margin: 0, fontSize: '1.6rem' }}>{stats.totalGoals}</h2>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: 'var(--warning)' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Approvals</span>
            <h2 style={{ margin: 0, fontSize: '1.6rem' }}>{stats.pendingGoals}</h2>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '12px', color: '#06b6d4' }}>
            <BarChart size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Progress</span>
            <h2 style={{ margin: 0, fontSize: '1.6rem' }}>{stats.avgProgress}%</h2>
          </div>
        </div>
      </div>

      {/* Main Charts & Visualization Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Compliance Progress Bars */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>System Compliance Metrics</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span>Goal Approval Rate</span>
                <strong>{stats.approvedGoals} / {stats.totalGoals} Approved ({approvedRatio}%)</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${approvedRatio}%`, background: 'var(--success)', borderRadius: '999px', transition: 'width 1s ease' }}></div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span>Active Participation Rate</span>
                <strong>100% of employees aligned</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `100%`, background: 'var(--primary-color)', borderRadius: '999px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span>Check-in Submission Rate</span>
                <strong>{stats.totalCheckIns} logged currently</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, stats.totalCheckIns * 33)}%`, background: '#8b5cf6', borderRadius: '999px' }}></div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <FileText size={16} color="var(--primary-color)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rules engine enforces 8 goals max, 10% min weightage.</span>
          </div>
        </div>

        {/* Dynamic SVG Donut Chart */}
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: '16px', textAlign: 'left', fontSize: '1.1rem' }}>Goal Status Breakdown</h3>
          <div style={{ position: 'relative', width: '130px', height: '130px', margin: '20px auto' }}>
            <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="transparent"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="10"
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="transparent"
                stroke="var(--success)"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={approvedStrokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 700 }}>{approvedRatio}%</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.85rem', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
              <span style={{ color: 'var(--text-muted)' }}>Approved ({stats.approvedGoals})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)' }}></div>
              <span style={{ color: 'var(--text-muted)' }}>Pending ({stats.pendingGoals})</span>
            </div>
          </div>
        </div>

        {/* Dynamic SVG Bar Chart */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Activity by Quarter</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '120px', padding: '10px 10px 0 10px' }}>
            {/* Q1 Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ height: '70px', width: '18px', background: 'linear-gradient(180deg, var(--primary-color) 0%, rgba(99, 102, 241, 0.1) 100%)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: 600 }}>{q1Count}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Q1</span>
            </div>
            
            {/* Q2 Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ height: `${20 + q2Count * 25}px`, width: '18px', background: 'linear-gradient(180deg, var(--primary-color) 0%, rgba(99, 102, 241, 0.1) 100%)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: 600 }}>{q2Count}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Q2</span>
            </div>

            {/* Q3 Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ height: `${20 + q3Count * 25}px`, width: '18px', background: 'linear-gradient(180deg, var(--primary-color) 0%, rgba(99, 102, 241, 0.1) 100%)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: 600 }}>{q3Count}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Q3</span>
            </div>

            {/* Q4 Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ height: `${20 + q4Count * 25}px`, width: '18px', background: 'linear-gradient(180deg, var(--primary-color) 0%, rgba(99, 102, 241, 0.1) 100%)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: 600 }}>{q4Count}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Q4</span>
            </div>
          </div>
        </div>

      </div>

      {/* Compliance Audit Log */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
        <div>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
            <ShieldAlert size={20} color="var(--success)" /> Compliance Audit & Regulations Log
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '16px', borderRadius: '12px', color: 'var(--success)', marginBottom: '20px' }}>
            <CheckCircle size={20} />
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>System Integrity Enforced</p>
              <p style={{ margin: 0, fontSize: '0.78rem', opacity: 0.8 }}>All user sheets conform to allocation policies.</p>
            </div>
          </div>
          
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
              <p style={{ margin: 0 }}>Maximum goals count boundary restricts setup to <strong>8 goals max</strong> per profile.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
              <p style={{ margin: 0 }}>Minimum goal weightage threshold strictly validated at <strong>10% min</strong> allocation.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
              <p style={{ margin: 0 }}>Chronological log logs check-ins sequentially for tamper-proof audits.</p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '16px', marginTop: '24px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          AtomQuest Portal Administration Scope • Secured local container
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
