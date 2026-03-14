import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, title }) => {
  const [initials, setInitials] = useState('U');

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        setInitials((parts[0][0] + parts[1][0]).toUpperCase());
      } else if (parts.length === 1 && parts[0].length > 0) {
        setInitials(parts[0].substring(0, 2).toUpperCase());
      }
    }
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        {title && (
          <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--corporate-navy)' }}>{title}</h1>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>Welcome back to your interview preparation.</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                background: 'var(--corporate-navy)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px'
              }} title={localStorage.getItem('userName') || 'User'}>
                {initials}
              </div>
            </div>
          </header>
        )}
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
