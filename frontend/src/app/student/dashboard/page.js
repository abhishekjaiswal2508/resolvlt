"use client";
import { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import api from '../../../api/axios';
import { RefreshCw, Search } from 'lucide-react';

export default function StudentDashboard() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/complaints');
            setComplaints(data);
        } catch (error) {
            console.error('Failed to fetch complaints');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const getStatusBadge = (status) => {
        const cls = status === 'Pending' ? 'badge-pending' : status === 'In Progress' ? 'badge-inprogress' : 'badge-resolved';
        return <span className={`badge ${cls}`}>{status}</span>;
    };

    return (
        <DashboardLayout title="My Complaints">
            <div className="filters-bar">
                <div className="input-container" style={{ width: '250px' }}>
                    <Search className="input-icon" />
                    <input type="text" placeholder="Search complaints..." className="input-field" style={{ paddingLeft: '2.5rem', paddingRight: '1rem', paddingBottom: '0.6rem', paddingTop: '0.6rem', fontSize: '0.875rem' }} />
                </div>
                <button 
                    onClick={fetchComplaints} 
                    className="btn-secondary" 
                    style={{ padding: '0.5rem', display: 'flex' }}
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin text-primary' : ''} style={loading ? { animation: 'spin 1s linear infinite', color: 'var(--primary)' } : {}} />
                </button>
            </div>

            <div className="complaints-list">
                {complaints.length === 0 && !loading ? (
                    <div className="text-center text-muted" style={{ padding: '3rem' }}>
                        You haven't filed any complaints yet.
                    </div>
                ) : (
                    complaints.map(c => (
                        <div key={c.complaint_id} className="glass-panel complaint-card animate-fade-in">
                            <div className="card-content">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold" style={{ margin: 0 }}>{c.title}</h3>
                                    {getStatusBadge(c.status)}
                                </div>
                                <p className="card-desc">{c.description}</p>
                                <div className="card-meta">
                                    <span className="meta-pill">Category: {c.category_name || 'N/A'}</span>
                                    <span className="meta-pill">Filed: {new Date(c.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            {c.file_path && (
                                <div>
                                    <a href={`http://localhost:5000${c.file_path}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        View Attached Proof
                                    </a>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}
