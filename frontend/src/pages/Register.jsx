import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) navigate('/dashboard');
  };

  const handleDemoRegister = async () => {
    const demoData = {
      name: 'Demo User',
      email: 'demo_user_fileforge@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    };
    setFormData(demoData);
    const result = await register(demoData.name, demoData.email, demoData.password);
    if (result.success) navigate('/dashboard');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const benefits = [
    'Unlimited free conversions',
    'Up to 100MB file size',
    '2-hour cloud storage',
    'Encrypted & secure transfers'
  ];

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: '900px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
        
        {/* Left Side: Info */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="hide-mobile"
        >
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div style={{ width: 40, height: 40, background: 'var(--gradient-accent)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700 }}>
              PDF<span style={{ color: 'var(--accent-bright)' }}>Craft</span>
            </span>
          </Link>
          
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Join millions of users <br />
            <span style={{ background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>converting with ease.</span>
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px', lineHeight: 1.6 }}>
            Get access to professional PDF tools and manage your documents all in one place.
          </p>

          <div style={{ display: 'grid', gap: '16px' }}>
            {benefits.map((benefit, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={18} color="var(--accent-bright)" />
                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Create your account</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>It's free and always will be</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Full Name</label>
                <input
                  className="input"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Email Address</label>
                <input
                  className="input"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ paddingRight: '44px' }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', color: 'var(--text-muted)', padding: '4px',
                  }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Confirm Password</label>
                <input
                  className="input"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px' }}>Passwords do not match</p>
                )}
              </div>

              <button type="submit" disabled={loading || (formData.confirmPassword && formData.password !== formData.confirmPassword)} className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', fontWeight: 600 }}>
                {loading ? <><div className="spinner" /> Creating account...</> : 'Get Started Free'}
              </button>

              <button type="button" onClick={handleDemoRegister} className="btn"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', fontWeight: 600, marginTop: '12px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Register as Demo User
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--accent-bright)', fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
