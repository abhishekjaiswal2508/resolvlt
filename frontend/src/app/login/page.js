"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (!res.success) {
            setError(res.message);
        }
    };

    return (
        <main className="app-container">
            <div className="glass-panel auth-card animate-fade-in">
                <div className="blob blob-blue pos-top-right"></div>

                <div className="text-center mb-4" style={{ position: 'relative', zIndex: 10 }}>
                    <div className="icon-circle">
                        <Lock size={32} />
                    </div>
                    <h2 className="hero-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p className="text-muted">Sign in to ResolvIt</p>
                </div>

                {error && (
                    <div className="alert-error animate-fade-in">
                        <AlertCircle size={20} style={{ flexShrink: 0 }} />
                        <p style={{ margin: 0 }}>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 10, marginTop: '2rem' }}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="input-container">
                            <Mail className="input-icon" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="you@college.edu"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-container">
                            <Lock className="input-icon" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary w-full mt-4" style={{ padding: '0.875rem' }}>
                        Sign In
                    </button>
                </form>

                <div className="text-center text-muted" style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
                    {"Don't have an account? "}
                    <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                        Register here
                    </Link>
                </div>
            </div>
        </main>
    );
}
