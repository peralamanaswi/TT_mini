import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserRoundCheck, MessageSquareText, TrendingUp, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/role', name: 'Role Selection', icon: <Users size={20} /> },
    { path: '/interview', name: 'Mock Interview', icon: <UserRoundCheck size={20} /> },
    { path: '/feedback', name: 'Feedback', icon: <MessageSquareText size={20} /> },
    { path: '/progress', name: 'Progress', icon: <TrendingUp size={20} /> },
  ];

  return (
    <nav style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      backgroundColor: 'var(--corporate-navy)',
      color: 'white',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
      zIndex: 100
    }}>
      <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          width: '36px', height: '36px', 
          background: 'linear-gradient(135deg, var(--electric-blue), #60A5FA)', 
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 'bold', fontSize: '1.2rem'
        }}>
          AI
        </div>
        <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem', fontWeight: '600', letterSpacing: '0.5px' }}>
          Smart Portal
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <p style={{ color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', marginLeft: '0.5rem' }}>Menu</p>
        
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: isActive ? 'white' : '#CBD5E1',
                backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--electric-blue)' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                fontWeight: isActive ? '500' : '400',
              }}
            >
              <div style={{ color: isActive ? 'var(--electric-blue)' : '#94A3B8' }}>
                {item.icon}
              </div>
              {item.name}
            </NavLink>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <NavLink to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            color: '#CBD5E1',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
        }}>
          <LogOut size={20} color="#94A3B8" />
          Logout
        </NavLink>
      </div>
    </nav>
  );
};

export default Sidebar;
