import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import { CheckCircle2, AlertTriangle, Zap, MessageSquareText } from "lucide-react";

function Feedback() {
  
  const scores = [
    { label: "Technical Accuracy", score: 85, color: "var(--soft-mint)" },
    { label: "Communication", score: 92, color: "var(--electric-blue)" },
    { label: "Problem Solving", score: 68, color: "#F59E0B" }
  ];

  const suggestions = [
    { type: "positive", text: "Excellent explanation of basic Object-Oriented principles. Real-world examples were clear.", icon: <CheckCircle2 size={20} color="var(--soft-mint)" /> },
    { type: "improvement", text: "System design answer focused too heavily on databases. Remember to discuss load balancers and caching strategies.", icon: <AlertTriangle size={20} color="#F59E0B" /> },
    { type: "action", text: "Review advanced SQL joins and query optimization.", icon: <Zap size={20} color="var(--electric-blue)" /> }
  ];

  return (
    <DashboardLayout title="Deep AI Feedback">
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Score Overview Panel */}
        <div className="glass-panel floating-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '120px', height: '120px', 
              borderRadius: '50%', 
              border: '8px solid var(--electric-blue)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
            }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--corporate-navy)' }}>82%</span>
            </div>
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Overall Match</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0' }}>Good potential, requires minor refinement.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {scores.map((s, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{s.label}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{s.score}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.score}%`, background: s.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Detailed Insights Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel floating-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <MessageSquareText size={20} color="var(--electric-blue)" />
              AI Analysis & Suggestions
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {suggestions.map((s, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'flex-start', gap: '1rem',
                  padding: '1.25rem', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.8)'
                }}>
                  <div style={{ flexShrink: 0 }}>{s.icon}</div>
                  <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: '1.5' }}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel floating-card" style={{ background: 'linear-gradient(135deg, var(--corporate-navy), var(--corporate-navy-light))', color: 'white' }}>
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Recommended Next Step</h3>
            <p style={{ color: '#94A3B8', marginBottom: '1.5rem' }}>Based on your performance, we recommend focusing on System Architecture interviews.</p>
            <button className="btn-primary" style={{ background: 'var(--electric-blue)', border: 'none' }}>Start Recommended Practice</button>
          </div>

        </div>
      </div>

    </DashboardLayout>
  );
}

export default Feedback;