"use client";
import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import api from '../../../api/axios';
import { useRouter } from 'next/navigation';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

export default function NewComplaint() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '', category_id: '' });
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const router = useRouter();

    useEffect(() => {
        api.get('/complaints/categories').then(({ data }) => {
            setCategories(data);
            if (data.length > 0) setFormData(f => ({ ...f, category_id: data[0].category_id }));
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Submitting complaint...' });

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category_id', formData.category_id);
        if (file) {
            data.append('proof', file);
        }

        try {
            await api.post('/complaints', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus({ type: 'success', msg: 'Complaint submitted successfully!' });
            setTimeout(() => router.push('/student/dashboard'), 1500);
        } catch (error) {
            setStatus({ type: 'error', msg: error.response?.data?.message || 'Failed to submit.' });
        }
    };

    return (
        <DashboardLayout title="File a New Complaint">
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem', maxWidth: '48rem', margin: '0 auto', position: 'relative' }}>
                {status.msg && (
                    <div className="alert-error" style={status.type === 'success' ? { background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)', color: 'var(--success)' } : status.type === 'loading' ? { background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.3)', color: 'var(--primary)' } : {}}>
                        {status.type === 'success' && <CheckCircle2 size={20} />}
                        <p style={{ margin: 0 }}>{status.msg}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                            className="input-field"
                            value={formData.category_id}
                            onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                            style={{ appearance: 'none' }}
                        >
                            {categories.map(c => (
                                <option key={c.category_id} value={c.category_id} style={{ background: '#0f172a' }}>{c.category_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="Briefly describe the issue..."
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Detailed Description</label>
                        <textarea
                            required
                            rows={4}
                            className="input-field"
                            placeholder="Provide details about location and what needs fixing..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            style={{ resize: 'none' }}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Attach Proof (Image/Video)</label>
                        <div style={{ position: 'relative', border: '2px dashed var(--border)', borderRadius: '8px', padding: '2rem', textAlign: 'center', transition: 'border-color 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer' }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                                <UploadCloud size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                                    {file ? file.name : "Click or drag file to upload"}
                                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Max size: 5MB</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ paddingTop: '1rem', textAlign: 'right' }}>
                        <button type="submit" className="btn-primary" disabled={status.type === 'loading'}>
                            Submit Complaint
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
