import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", user);
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="glass-panel floating-card animate-fade-in" style={{
        maxWidth: '400px',
        width: '100%',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px',
            background: 'linear-gradient(135deg, var(--electric-blue), #60A5FA)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 'bold', fontSize: '1.5rem',
            margin: '0 auto 1.5rem'
          }}>
            AI
          </div>
          <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>Create Account</h1>
          <p style={{ margin: 0 }}>Join the Smart Interview Portal</p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            color: '#EF4444',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ position: 'relative' }}>
            <User size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="input-field"
              name="name"
              type="text"
              placeholder="Full Name"
              onChange={handleChange}
              style={{ paddingLeft: '2.75rem' }}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Mail size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="input-field"
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              style={{ paddingLeft: '2.75rem' }}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="input-field"
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              style={{ paddingLeft: '2.75rem' }}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.875rem' }}>
            <UserPlus size={18} />
            Create Account
          </button>
        </form>

        <p style={{ textAlign: 'center', margin: 0, fontSize: '0.9rem' }}>
          Already have an account? <Link to="/" style={{ fontWeight: '500' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;