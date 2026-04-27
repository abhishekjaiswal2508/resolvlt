"use client";
import { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import api from '../../../api/axios';
import { RefreshCw, PlayCircle, CheckCircle } from 'lucide-react';

export default function StaffDashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/complaints');
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleUpdateStatus = async (complaintId, newStatus) => {
        try {
            await api.put(`/complaints/${complaintId}/status`, { status: newStatus });
            fetchTasks(); 
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const getStatusBadge = (status) => {
        const cls = status === 'Pending' ? 'badge-pending' : status === 'In Progress' ? 'badge-inprogress' : 'badge-resolved';
        return <span className={`badge ${cls}`}>{status}</span>;
    };

    return (
        <DashboardLayout title="My Assigned Tasks">
            <div className="filters-bar" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <p className="text-muted">View and update complaints assigned to you.</p>
                <button 
                    onClick={fetchTasks} 
                    className="btn-secondary" 
                    style={{ padding: '0.5rem', display: 'flex' }}
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin text-primary' : ''} style={loading ? { animation: 'spin 1s linear infinite', color: 'var(--primary)' } : {}} />
                </button>
            </div>

            <div className="complaints-list">
                {tasks.length === 0 && !loading ? (
                    <div className="text-center text-muted" style={{ padding: '3rem' }}>
                        No tasks assigned to you right now.
                    </div>
                ) : (
                    tasks.map(t => (
                        <div key={t.complaint_id} className="glass-panel complaint-card animate-fade-in">
                            <div className="card-content">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold" style={{ margin: 0 }}>{t.title}</h3>
                                    {getStatusBadge(t.status)}
                                </div>
                                <p className="card-desc">{t.description}</p>
                                <div className="card-meta">
                                    <span className="meta-pill">Student: {t.student_name}</span>
                                    <span className="meta-pill">Category: {t.category_name}</span>
                                    {t.file_path && (
                                        <a href={`http://localhost:5000${t.file_path}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>View Proof</a>
                                    )}
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {t.status === 'Pending' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(t.complaint_id, 'In Progress')}
                                        className="btn-secondary"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', borderColor: 'rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.1)' }}
                                    >
                                        <PlayCircle size={16} />
                                        Start Work
                                    </button>
                                )}
                                {t.status === 'In Progress' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(t.complaint_id, 'Resolved')}
                                        className="btn-secondary"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)' }}
                                    >
                                        <CheckCircle size={16} />
                                        Mark Resolved
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}
