import React from 'react';
import { ArrowRight, ChevronDown, Award, Target, CheckCircle2, TrendingUp, BarChart2, ShieldCheck, Shield, Lock, FileSpreadsheet, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg" style={{ backgroundImage: 'url(/images/hero.png)' }}></div>
        <div className="hero-overlay"></div>
        
        <div className="scroll-indicator">
          <span className="scroll-text">Scroll</span>
          <ChevronDown size={20} className="scroll-icon" />
        </div>

        <div className="hero-content">
          <h1 className="hero-title">AtomQuest Goal Setting</h1>
          <p className="hero-subtitle">
            A structured, digital Goal Setting & Tracking Portal that eliminates pain points, 
            providing clear alignment from creation to quarterly check-ins.
          </p>
          <button className="btn btn-primary btn-large mt-6" onClick={() => navigate('/login')}>
            ACCESS PORTAL <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section" id="about">
        <div className="about-container grid-2-cols">
          <div className="about-image-wrapper">
            <div className="about-image-border"></div>
            <img src="/images/about.png" alt="Modern Office" className="about-image" />
          </div>
          
          <div className="about-text">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>About The Portal</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '1.05rem', lineHeight: '1.7' }}>
              Organizations that rely on manual or fragmented goal-tracking methods often struggle with alignment, visibility, and accountability. Spreadsheets, emails, and offline review cycles create communication blocks.
            </p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '1.05rem', lineHeight: '1.7' }}>
              Our mission is to build a structured, digital **Goal Setting & Tracking Portal** that eliminates these pain points. The system supports the full lifecycle of employee goals — from creation and alignment to quarterly check-ins and performance visibility.
            </p>
            
            {/* Core Values grid */}
            <div className="grid-2-cols">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: 'var(--primary-color)' }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>Strict Compliance</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rules engine enforces 10% min weightage and 8 goals max limit.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: 'var(--success)' }}>
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>Performance-Driven</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Automated tracking checks planned vs actual metrics in Q1-Q4.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Growth Pillars Section */}
      <section className="services-section" id="services" style={{ padding: '100px 24px' }}>
        <div className="section-header">
          <h2 style={{ background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Strategic Execution Pillars</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Empowering modern enterprises with transparency, alignment, and analytical precision.</p>
          <div className="header-line" style={{ marginTop: '16px' }}></div>
        </div>
        
        <div className="pillars-grid">
          
          {/* Pillar 1: Alignment & Clarity */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '32px 24px' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Target size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Alignment & Clarity</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Bridge the gap between executive vision and employee execution. Ensure every key thrust area directly supports corporate objectives with clear, unified focus.
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, marginTop: '20px' }}>01. CORPORATE HARMONY</span>
          </div>

          {/* Pillar 2: Operational Discipline */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '32px 24px' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Operational Discipline</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Cultivate structured review accountability. Replace scattered spreadsheets with interactive milestones, ensuring every metric is locked and verified.
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600, marginTop: '20px' }}>02. PROCESS EXCELLENCE</span>
          </div>

          {/* Pillar 3: Dynamic Tracking */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '32px 24px' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Dynamic Progress</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Track targets versus actual achievements in real-time across multiple fiscal periods. Foster a results-oriented culture of continuous improvement.
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 600, marginTop: '20px' }}>03. AGILE EXECUTION</span>
          </div>

          {/* Pillar 4: Empowered Analytics */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '32px 24px' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <BarChart2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Compliance Insights</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Gain high-fidelity auditing visibility. Empower leadership and compliance officers with unified completion metrics and alignment statistics.
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600, marginTop: '20px' }}>04. DATA INTEGRITY</span>
          </div>

        </div>
      </section>

      {/* Rebranded Governance & Compliance Section */}
      <section className="projects-section" id="projects" style={{ padding: '100px 24px', background: 'var(--bg-color)' }}>
        <div className="section-header" style={{ marginBottom: '60px' }}>
          <h2 style={{ background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Governance & Compliance</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Designed to meet strict regulatory boundaries and institutional integrity.</p>
          <div className="header-line" style={{ marginTop: '16px' }}></div>
        </div>
        
        <div className="governance-grid">
          
          {/* Governance Details Column */}
          <div style={{ display: 'grid', gap: '32px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--primary-color)' }}>
                <Shield size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>1. Strict Metric Constraints</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  The portal acts as a strict rules engine, preventing mathematical overruns. Total goal weightage is restricted to exactly 100%, and each individual goal is bound by a 10% minimum threshold.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--success)' }}>
                <Lock size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>2. Tamper-Proof Audit Lock</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Once goals pass review and are formally approved by direct managers, they are instantly frozen. Post-approval adjustments are disabled, establishing a reliable, unalterable historical baseline.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: '#a78bfa' }}>
                <Eye size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>3. Multi-Faceted System Audit</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Ensures complete transparency for auditors. Every registered check-in is logged chronologically, complete with planned targets, actual accomplishments, and manager reviews.
                </p>
              </div>
            </div>
          </div>

          {/* Graphical Governance Panel */}
          <div className="glass-card grid-2-cols" style={{ padding: '40px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(30, 41, 59, 0.4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderLeft: '3px solid var(--primary-color)', paddingLeft: '16px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Privilege Scopes</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>Role-Based Access</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Secure Employee & Manager scopes</p>
              </div>
              <div style={{ borderLeft: '3px solid var(--success)', paddingLeft: '16px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Policy Engine</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>Weightage Validation</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Continuous compliance matching</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderLeft: '3px solid var(--warning)', paddingLeft: '16px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Period Control</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>Closed Cycle Lock</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unalterable approved history</p>
              </div>
              <div style={{ borderLeft: '3px solid #8b5cf6', paddingLeft: '16px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Compliance Oversight</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>Audit Reporting Log</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Live compliance ratios</p>
              </div>
            </div>
          </div>

        </div>
      </section>
      
      {/* Simple Footer */}
      <footer className="footer">
        <p>&copy; 2026 AtomQuest Hackathon. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
