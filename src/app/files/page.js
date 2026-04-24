'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Trash2, ExternalLink } from 'lucide-react';
import { formatCurrency, formatDate, formatMB } from '@/utils/format';
import PaginationControls from '@/components/PaginationControls';

export default function Files() {
  const [files, setFiles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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

  if (loading) return <div>Loading files...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>File Management</h1>

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
              <th>Email</th>
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
                <td>{file.users?.email || 'N/A'}</td>
                <td>{formatMB((file.size || 0) / (1024 * 1024))}</td>
                <td>{file.total_views || 0}</td>
                <td>{formatCurrency(file.total_earnings)}</td>
                <td>{formatDate(file.created_at)}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(file.id)}
                    className="btn-danger"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {files.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No files found.</td>
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
