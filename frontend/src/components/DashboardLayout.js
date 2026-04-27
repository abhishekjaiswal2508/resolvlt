import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Shield as AdminIcon, PenTool as StaffIcon, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children, title }) {
    const { user, logout } = useAuth();

    if (!user) return null;

    const navLinks = {
        Student: [
            { name: 'My Complaints', href: '/student/dashboard', icon: <UserIcon size={18} /> },
            { name: 'File Complaint', href: '/student/new-complaint', icon: <PlusCircle size={18} /> }
        ],
        Admin: [
            { name: 'All Complaints', href: '/admin/dashboard', icon: <AdminIcon size={18} /> }
        ],
        Maintenance: [
            { name: 'My Tasks', href: '/staff/dashboard', icon: <StaffIcon size={18} /> }
        ]
    };

    const links = navLinks[user.role] || [];

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <h1 className="hero-title" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                        <span className="gradient-text">ResolvIt</span>
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', marginRight: '8px' }}></span>
                        {user.role} Panel
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {links.map(link => (
                        <Link 
                            key={link.name} 
                            href={link.href}
                            className="sidebar-link"
                        >
                            <span className="sidebar-icon">{link.icon}</span>
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-badge">
                        <p className="font-medium">{user.username}</p>
                        <p className="text-muted text-sm">{user.email}</p>
                    </div>
                    <button onClick={logout} className="btn-logout">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Background Blobs */}
                <div className="blob blob-blue pos-top-right"></div>
                <div className="blob blob-emerald pos-bottom-left"></div>

                {/* Header */}
                <header className="top-header">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <div className="header-actions">
                        {/* Status indicators */}
                    </div>
                </header>

                <div className="content-area animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
