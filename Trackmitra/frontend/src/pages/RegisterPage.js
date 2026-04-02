import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.firstName.trim()) return setError('Please enter your first name.');
    if (!form.email.trim()) return setError('Please enter your email address.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
      await register(fullName, form.email, form.password, form.phone);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-blob ab1"></div>
        <div className="auth-blob ab2"></div>
        <div className="auth-grid"></div>
      </div>

      <Link to="/" className="auth-back">← Back to Home</Link>

      <div className="auth-card card fade-in">
        <div className="auth-header">
          <span className="auth-logo">🚗</span>
          <h2>Create account</h2>
          <p>Start tracking city transport for free</p>
        </div>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="name-row">
            <div className="input-group">
              <label>First Name</label>
              <input className="form-input" name="firstName" placeholder="Raj"
                value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input className="form-input" name="lastName" placeholder="Sharma"
                value={form.lastName} onChange={handleChange} />
            </div>
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input className="form-input" type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Phone Number <span style={{color:'var(--text-dim)',fontWeight:400}}>(optional)</span></label>
            <input className="form-input" type="tel" name="phone" placeholder="+91 98765 43210"
              value={form.phone} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input className="form-input" type="password" name="password" placeholder="Min 6 characters"
              value={form.password} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input className="form-input" type="password" name="confirm" placeholder="Repeat password"
              value={form.confirm} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
