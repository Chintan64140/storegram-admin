'use client';
import Loader from '@/components/Loader';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { MapPin, Monitor } from 'lucide-react';
import { formatDateTime } from '@/utils/format';
import PaginationControls from '@/components/PaginationControls';

export default function Views() {
  const [views, setViews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchViews = async () => {
    try {
      setError('');
      const response = await api.get('/admin/views', { params: { page, limit } });
      setViews(response.data.data || []);
      setPagination(response.data.pagination || null);
    } catch (err) {
      console.error('Error fetching views', err);
      setError(err.response?.data?.error || 'Failed to load views.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchViews();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [page, limit]);

  if (loading) return <Loader text="Loading views..." />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Recent Platform Views</h1>

      {error && (
        <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'rgba(255, 77, 77, 0.3)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Publisher</th>
              <th>Watch Time (s)</th>
              <th>Location</th>
              <th>IP Address</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {views.map(view => (
              <tr key={view.id}>
                <td>{view.files?.title || 'Unknown File'}</td>
                <td>{view.users?.name || 'Unknown'}</td>
                <td>{view.watch_time || 0}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={14} color="var(--text-secondary)" />
                    {view.location || 'Unknown'}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Monitor size={14} color="var(--text-secondary)" />
                    {view.ip_address || 'Unknown'}
                  </div>
                </td>
                <td>
                  {view.is_valid ? (
                    <span className="badge badge-success">Valid</span>
                  ) : (
                    <span className="badge badge-warning">Invalid / Watching</span>
                  )}
                </td>
                <td>{formatDateTime(view.created_at)}</td>
              </tr>
            ))}
            {views.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No views recorded yet.</td>
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
          limitOptions={[10, 20, 50, 100]}
        />
      </div>
    </div>
  );
}
