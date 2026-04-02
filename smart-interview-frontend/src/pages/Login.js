import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", login);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userName", res.data.name); // Store name for the profile icon
      localStorage.setItem("targetRole", res.data.targetRole || "");
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
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
          <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>Welcome Back</h1>
          <p style={{ margin: 0 }}>Sign in to continue your preparation</p>
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
            <LogIn size={18} />
            Sign In
          </button>
        </form>

        <p style={{ textAlign: 'center', margin: 0, fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: '500' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
