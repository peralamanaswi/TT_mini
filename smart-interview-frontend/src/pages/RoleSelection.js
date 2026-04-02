import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import API from "../services/api";
import { Code2, LayoutTemplate, Server, LineChart, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RoleSelection() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Java Developer");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    { id: "Java Developer", title: "Java Developer", icon: <Server size={32} />, desc: "Backend systems, Spring Boot, APIs" },
    { id: "Frontend Developer", title: "Frontend Developer", icon: <LayoutTemplate size={32} />, desc: "React, UI/UX, Web Performance" },
    { id: "Full Stack Developer", title: "Full Stack Developer", icon: <Code2 size={32} />, desc: "End-to-end development, architecture" },
    { id: "Data Analyst", title: "Data Analyst", icon: <LineChart size={32} />, desc: "SQL, Python, Data Visualization" },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const userId = localStorage.getItem("userId");
      await API.post("/role/select", { userId, targetRole: role });
      localStorage.setItem("targetRole", role);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to save role");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Role Selection">
      <div style={{ maxWidth: '900px' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Select the specific role you are targeting to tailor your mock interviews and AI feedback.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {roles.map((r) => {
            const isSelected = role === r.id;
            return (
              <div 
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`glass-panel floating-card ${isSelected ? 'selected-role' : ''}`}
                style={{ 
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--electric-blue)' : 'var(--glass-border)',
                  background: isSelected ? 'white' : 'var(--glass-bg)',
                  display: 'flex', flexDirection: 'column', gap: '1rem',
                  position: 'relative'
                }}
              >
                {isSelected && (
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--electric-blue)' }}>
                    <CheckCircle2 size={24} fill="white" />
                  </div>
                )}
                
                <div style={{ 
                  width: '56px', height: '56px', 
                  borderRadius: '12px', 
                  background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.05)',
                  color: isSelected ? 'var(--electric-blue)' : 'var(--corporate-navy)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {r.icon}
                </div>
                
                <div>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>{r.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{r.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={handleSubmit} 
          className="btn-primary" 
          disabled={isSubmitting}
          style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
        >
          {isSubmitting ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </DashboardLayout>
  );
}

export default RoleSelection;
