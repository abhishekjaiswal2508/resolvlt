"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Shield, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Student'
    });
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await register(formData);
        if (!res.success) {
            setError(res.message);
        }
    };

    return (
        <main className="app-container">
            <div className="glass-panel auth-card animate-fade-in" style={{ maxWidth: '32rem' }}>
                <div className="blob blob-emerald pos-bottom-left"></div>

                <div className="text-center mb-4" style={{ position: 'relative', zIndex: 10 }}>
                    <div className="icon-circle" style={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)' }}>
                        <User size={32} />
                    </div>
                    <h2 className="hero-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h2>
                    <p className="text-muted">Join the ResolvIt Platform</p>
                </div>

                {error && (
                    <div className="alert-error animate-fade-in">
                        <AlertCircle size={20} style={{ flexShrink: 0 }} />
                        <p style={{ margin: 0 }}>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 10, marginTop: '2rem' }}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div className="input-container">
                            <User className="input-icon" />
                            <input
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                className="input-field"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">College Email</label>
                        <div className="input-container">
                            <Mail className="input-icon" />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="input-field"
                                placeholder="john@college.edu"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-container">
                                <Lock className="input-icon" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="input-field"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Account Role</label>
                            <div className="input-container">
                                <Shield className="input-icon" />
                                <select
                                    className="input-field"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    style={{ appearance: 'none' }}
                                >
                                    <option value="Student">Student</option>
                                    <option value="Maintenance">Staff</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full mt-4" style={{ padding: '0.875rem' }}>
                        Create Account
                    </button>
                </form>

                <div className="text-center text-muted" style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
                    {"Already have an account? "}
                    <Link href="/login" style={{ color: 'var(--success)', fontWeight: 500 }}>
                        Login here
                    </Link>
                </div>
            </div>
        </main>
    );
}
