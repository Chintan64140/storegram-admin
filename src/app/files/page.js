'use client';
import Loader from '@/components/Loader';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Trash2, ExternalLink, Eye, X } from 'lucide-react';
import { formatCurrency, formatDate, formatMB } from '@/utils/format';
import PaginationControls from '@/components/PaginationControls';

const VIDEO_EXTENSIONS = new Set(['mp4', 'mkv', 'webm', 'mov', 'm4v']);
const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']);
const DOCUMENT_EXTENSIONS = new Set(['pdf', 'txt']);

const getFileExtension = (file) => {
  const source = file?.file_url || file?.title || '';
  const cleanSource = source.split('?')[0].split('#')[0];
  const extension = cleanSource.includes('.') ? cleanSource.split('.').pop() : '';
  return String(extension || '').toLowerCase();
};

const getPreviewType = (file) => {
  const extension = getFileExtension(file);
  if (VIDEO_EXTENSIONS.has(extension)) return 'video';
  if (IMAGE_EXTENSIONS.has(extension)) return 'image';
  if (DOCUMENT_EXTENSIONS.has(extension)) return 'document';
  return 'file';
};

function PreviewModal({ file, onClose, onDelete }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!file) return null;

  const previewType = getPreviewType(file);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.75)', padding: '1rem', backdropFilter: 'blur(4px)'
      }}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', background: 'var(--surface)' }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{file.title || 'Untitled File'}</h2>
            <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>{file.description || 'No description added.'}</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', minHeight: '300px', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', overflow: 'hidden' }}>
          {previewType === 'video' && <video src={file.file_url} controls playsInline style={{ maxHeight: '60vh', width: '100%' }} />}
          {previewType === 'image' && <img src={file.file_url} alt={file.title} style={{ maxHeight: '60vh', maxWidth: '100%', objectFit: 'contain' }} />}
          {previewType === 'document' && <iframe src={file.file_url} style={{ height: '60vh', width: '100%', border: 0 }} />}
          {previewType === 'file' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Preview not available inline</h3>
              <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <ExternalLink size={16} /> Open File
              </a>
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--surface-strong)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Short ID</div>
            <div style={{ fontWeight: 'bold', wordBreak: 'break-all' }}>{file.short_id || 'N/A'}</div>
          </div>
          <div style={{ background: 'var(--surface-strong)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Publisher</div>
            <div style={{ fontWeight: 'bold' }}>{file.users?.name || 'Unknown'}</div>
          </div>
          <div style={{ background: 'var(--surface-strong)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Size</div>
            <div style={{ fontWeight: 'bold' }}>{formatMB((file.size || 0) / (1024 * 1024))}</div>
          </div>
          <div style={{ background: 'var(--surface-strong)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Views</div>
            <div style={{ fontWeight: 'bold' }}>{Number(file.total_views || 0).toLocaleString()}</div>
          </div>
          <div style={{ background: 'var(--surface-strong)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Earnings</div>
            <div style={{ fontWeight: 'bold', color: 'var(--success)' }}>{formatCurrency(file.total_earnings)}</div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <button onClick={onClose} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1rem' }}>
            Close
          </button>
          <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.5rem 1rem' }}>
            <ExternalLink size={16} /> Open in New Tab
          </a>
          <button 
            onClick={() => onDelete(file.id)}
            className="btn-danger"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Files() {
  const [files, setFiles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [previewFile, setPreviewFile] = useState(null);

  const fetchFiles = async () => {
    try {
      setError('');
      const response = await api.get('/admin/files', { params: { page, limit } });
      setFiles(response.data.data || []);
      setPagination(response.data.pagination || null);
    } catch (err) {
      console.error('Error fetching files', err);
      setError(err.response?.data?.error || 'Failed to load files.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchFiles();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [page, limit]);

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to permanently delete this file and remove it from cloud storage?")) return;
    try {
      await api.delete(`/admin/files/${fileId}`);
      setMessage('File deleted successfully.');
      await fetchFiles();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete file.');
    }
  };

  if (loading) return <Loader text="Loading files..." />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>File Management</h1>
      
      {previewFile && <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} onDelete={(id) => { setPreviewFile(null); handleDelete(id); }} />}

      {(error || message) && (
        <div className="card" style={{ marginBottom: '1.5rem', borderColor: error ? 'rgba(255, 77, 77, 0.3)' : 'rgba(0, 204, 102, 0.3)', color: error ? 'var(--danger)' : 'var(--success)' }}>
          {error || message}
        </div>
      )}

      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Publisher</th>
              <th>Size (MB)</th>
              <th>Views</th>
              <th>Earnings ($)</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map(file => (
              <tr key={file.id}>
                <td>
                  <a href={file.file_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {file.title || 'Untitled'} <ExternalLink size={14} />
                  </a>
                </td>
                <td>{file.users?.name || 'Unknown'}</td>
                <td>{formatMB((file.size || 0) / (1024 * 1024))}</td>
                <td>{file.total_views || 0}</td>
                <td>{formatCurrency(file.total_earnings)}</td>
                <td>{formatDate(file.created_at)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => setPreviewFile(file)}
                      className="btn-primary"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--accent-blue)', borderColor: 'var(--accent-blue)' }}
                    >
                      <Eye size={14} /> View
                    </button>
                    <button 
                      onClick={() => handleDelete(file.id)}
                      className="btn-danger"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {files.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No files found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <PaginationControls
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={(nextLimit) => {
            setLimit(nextLimit);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
