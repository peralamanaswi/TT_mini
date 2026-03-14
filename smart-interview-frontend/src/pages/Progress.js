import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import API from "../services/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, Award } from "lucide-react";

function Progress() {
  const [sessions, setSessions] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    API.get("/session/user/" + userId).then(res => setSessions(res.data));
  }, [userId]);

  // Mock data for the chart to ensure a beautiful display even if backend has no data yet
  const chartData = [
    { name: 'Week 1', score: 65, avg: 60 },
    { name: 'Week 2', score: 72, avg: 62 },
    { name: 'Week 3', score: 85, avg: 65 },
    { name: 'Week 4', score: 82, avg: 70 },
    { name: 'Week 5', score: 94, avg: 72 },
  ];

  return (
    <DashboardLayout title="Performance Analytics">
      
      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel floating-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--electric-blue)' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Growth Rate</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>+24%</h3>
          </div>
        </div>
        
        <div className="glass-panel floating-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--soft-mint)' }}>
            <Target size={28} />
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Target Score</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>90%</h3>
          </div>
        </div>

        <div className="glass-panel floating-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: '#F59E0B' }}>
            <Award size={28} />
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Current Level</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>Advanced</h3>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="glass-panel floating-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ margin: 0 }}>Interview Score Progression</h3>
          <select style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', outline: 'none' }}>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>All Time</option>
          </select>
        </div>
        
        <div style={{ height: '350px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--electric-blue)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--electric-blue)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '1rem' }}
                cursor={{ stroke: 'rgba(59, 130, 246, 0.2)', strokeWidth: 2, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="var(--electric-blue)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--electric-blue)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity List */}
      <h3 style={{ marginBottom: '1.5rem', marginTop: '2rem' }}>Recent Sessions</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sessions.length > 0 ? sessions.map(s => (
          <div key={s.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 0.25rem' }}>{s.role} Interview</h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{s.feedbackSummary}</p>
            </div>
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.1)', color: 'var(--soft-mint)', 
              padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold' 
            }}>
              {s.totalScore}%
            </div>
          </div>
        )) : (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No recent sessions found. Take a mock interview to see your history!
          </div>
        )}
      </div>

    </DashboardLayout>
  );
}

export default Progress;