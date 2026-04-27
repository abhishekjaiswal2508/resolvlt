import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <main className="app-container">
      <div className="glass-panel text-center animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '42rem' }}>
        
        {/* Decorative Blobs */}
        <div className="blob blob-blue pos-top-right"></div>
        <div className="blob blob-emerald pos-bottom-left"></div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div className="icon-circle shadow-lg" style={{ width: '5rem', height: '5rem', marginBottom: '1.5rem' }}>
            <ShieldCheck size={48} />
          </div>
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">ResolvIt</span>
          </h1>
          <p className="hero-subtitle">
            The intelligent, role-based Hostel Complaint Management System designed to resolve issues lightning fast.
          </p>
          <div className="flex" style={{ gap: '1rem', justifyContent: 'center' }}>
            <Link href="/login" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Access Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
