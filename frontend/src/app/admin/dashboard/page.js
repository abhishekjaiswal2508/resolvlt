"use client";
import { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import api from '../../../api/axios';
import { RefreshCw, UserPlus } from 'lucide-react';

export default function AdminDashboard() {
    const [complaints, setComplaints] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [assignedStaff, setAssignedStaff] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [assigning, setAssigning] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [compRes, staffRes] = await Promise.all([
                api.get('/complaints'),
                api.get('/assignments/staff')
            ]);
            setComplaints(compRes.data);
            setStaffList(staffRes.data);
        } catch (error) {
            console.error('Failed to fetch data');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssign = async (e) => {
        e.preventDefault();
        setAssigning(true);
        try {
            await api.post('/assignments', {
                complaint_id: selectedComplaint,
                assigned_to_user_id: assignedStaff,
                admin_notes: adminNotes
            });
            setSelectedComplaint(null);
            fetchData();
        } catch (error) {
            alert('Failed to assign complaint');
        }
        setAssigning(false);
    };

    const getStatusBadge = (status) => {
        const cls = status === 'Pending' ? 'badge-pending' : status === 'In Progress' ? 'badge-inprogress' : 'badge-resolved';
        return <span className={`badge ${cls}`}>{status}</span>;
    };

    const filtered = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

    return (
        <DashboardLayout title="All Complaints">
            <div className="filters-bar">
                <div className="filter-group">
                    {['All', 'Pending', 'In Progress', 'Resolved'].map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`filter-btn ${filter === f ? 'active' : ''}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={fetchData} 
                    className="btn-secondary" 
                    style={{ padding: '0.5rem', display: 'flex' }}
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin text-primary' : ''} style={loading ? { animation: 'spin 1s linear infinite', color: 'var(--primary)' } : {}} />
                </button>
            </div>

            <div className="complaints-list">
                {filtered.map(c => (
                    <div key={c.complaint_id} className="glass-panel complaint-card animate-fade-in">
                        <div className="card-content">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold" style={{ margin: 0 }}>{c.title}</h3>
                                {getStatusBadge(c.status)}
                            </div>
                            <p className="card-desc">{c.description}</p>
                            <div className="card-meta">
                                <span className="meta-pill">Student: {c.student_name}</span>
                                <span className="meta-pill">Category: {c.category_name}</span>
                                <span className="meta-pill">Filed: {new Date(c.created_at).toLocaleDateString()}</span>
                                {c.file_path && (
                                    <a href={`http://localhost:5000${c.file_path}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>View Proof</a>
                                )}
                            </div>
                        </div>
                        {c.status === 'Pending' && (
                            <div>
                                <button 
                                    onClick={() => setSelectedComplaint(c.complaint_id)}
                                    className="btn-secondary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', borderColor: 'rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.1)' }}
                                >
                                    <UserPlus size={16} />
                                    Assign Staff
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                
                {filtered.length === 0 && !loading && (
                    <div className="text-center text-muted" style={{ padding: '3rem' }}>
                        No complaints found for the selected filter.
                    </div>
                )}
            </div>

            {/* Assignment Modal */}
            {selectedComplaint && (
                <div className="modal-overlay animate-fade-in">
                    <div className="glass-panel modal-content">
                        <h3 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>Assign Maintenance Staff</h3>
                        <form onSubmit={handleAssign}>
                            <div className="form-group">
                                <label className="form-label">Select Staff Member</label>
                                <select 
                                    required
                                    className="input-field"
                                    value={assignedStaff}
                                    onChange={(e) => setAssignedStaff(e.target.value)}
                                    style={{ appearance: 'none' }}
                                >
                                    <option value="">-- Select Staff --</option>
                                    {staffList.map(s => (
                                        <option key={s.user_id} value={s.user_id} style={{ background: '#0f172a' }}>{s.username} - {s.email}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Admin Notes (Optional)</label>
                                <textarea 
                                    className="input-field" 
                                    rows={3}
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Special instructions..."
                                    style={{ resize: 'none' }}
                                ></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setSelectedComplaint(null)} className="btn-secondary" style={{ border: 'none', background: 'transparent' }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={assigning} className="btn-primary">
                                    {assigning ? 'Assigning...' : 'Assign Staff'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
