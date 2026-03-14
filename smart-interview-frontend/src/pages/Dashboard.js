import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Link } from "react-router-dom";
import { Activity, Target, Brain, AlertTriangle, ArrowRight } from "lucide-react";

function Dashboard() {
  
  const metrics = [
    { title: "Total Interviews", value: "12", icon: <Activity size={24} color="var(--electric-blue)" />, trend: "+2 this week" },
    { title: "Avg. AI Score", value: "84%", icon: <Target size={24} color="var(--soft-mint)" />, trend: "+5% improvement" },
    { title: "Confidence Level", value: "High", icon: <Brain size={24} color="#8B5CF6" />, trend: "Steady" },
    { title: "Weakest Skill", value: "System Design", icon: <AlertTriangle size={24} color="#F59E0B" />, trend: "Needs focus" },
  ];

  return (
    <DashboardLayout title="Dashboard">
      
      {/* Metrics Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {metrics.map((metric, index) => (
          <div key={index} className="glass-panel floating-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>{metric.title}</p>
                <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-primary)' }}>{metric.value}</h3>
              </div>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'rgba(255,255,255,0.5)', 
                borderRadius: '12px' 
              }}>
                {metric.icon}
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              {metric.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Row */}
      <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Quick Actions</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem'
      }}>
        <div className="glass-panel floating-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Start New Practice</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Select a specialized role and begin a new AI-guided mock interview session.</p>
          <Link to="/role" className="btn-primary" style={{ width: 'fit-content', marginTop: '0.5rem', textDecoration: 'none' }}>
            Select Role <ArrowRight size={16} />
          </Link>
        </div>

        <div className="glass-panel floating-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Review Feedback</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Analyze detailed feedback and AI suggestions from your previous interviews.</p>
          <Link to="/feedback" className="btn-primary" style={{ width: 'fit-content', marginTop: '0.5rem', backgroundColor: 'var(--corporate-navy)', textDecoration: 'none' }}>
            View Feedback <ArrowRight size={16} />
          </Link>
        </div>
      </div>

    </DashboardLayout>
  );
}

export default Dashboard;