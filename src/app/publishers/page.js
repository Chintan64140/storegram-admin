'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { formatCurrency, formatDate, formatMB, getStorageTotalMB, getStorageUsedMB } from '@/utils/format';
import PaginationControls from '@/components/PaginationControls';

export default function Publishers() {
  const [publishers, setPublishers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchPublishers = async () => {
    try {
      setError('');
      const response = await api.get('/admin/publishers', { params: { page, limit } });
      setPublishers(response.data.data || []);
      setPagination(response.data.pagination || null);
    } catch (err) {
      console.error('Error fetching publishers', err);
      setError(err.response?.data?.error || 'Failed to load publishers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchPublishers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [page, limit]);

  const handleApprove = async (publisherId) => {
    if (!window.confirm("Approve this publisher?")) return;
    try {
      await api.post('/admin/publishers/approve', { publisherId });
      setMessage('Publisher approved successfully.');
      await fetchPublishers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve publisher.');
    }
  };

  if (loading) return <div>Loading publishers...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Publisher Details</h1>

      {(error || message) && (
        <div className="card" style={{ marginBottom: '1.5rem', borderColor: error ? 'rgba(255, 77, 77, 0.3)' : 'rgba(0, 204, 102, 0.3)', color: error ? 'var(--danger)' : 'var(--success)' }}>
          {error || message}
        </div>
      )}

      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {/* <th>Mobile</th> */}
              <th>Referral Code</th>
              <th>Wallet</th>
              {/* <th>Storage Used</th>
              <th>Storage Limit</th> */}
              {/* <th>Files</th> */}
              <th>Total Views</th>
              <th>Total Earnings</th>
              {/* <th>Pending Withdrawals</th>
              <th>Approved Withdrawals</th> */}
              <th>Status</th>
              {/* <th>Joined</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {publishers.map(pub => (
              <tr key={pub.id}>
                <td>{pub.name}</td>
                <td>{pub.email}</td>
                <td>{pub.referral_code || 'N/A'}</td>
                <td>{formatCurrency(pub.wallet_balance)}</td>
               
                <td>{pub.stats?.totalViews || 0}</td>
                <td>{formatCurrency(pub.stats?.totalEarnings)}</td>
                <td>
                  {pub.is_approved ? (
                    <span className="badge badge-success">Approved</span>
                  ) : (
                    <span className="badge badge-warning">Pending Approval</span>
                  )}
                </td>
                {/* <td>{formatDate(pub.created_at)}</td> */}
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Link
                      href={`/publishers/${pub.id}`}
                      className="btn-primary"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <ExternalLink size={14} /> View
                    </Link>
                    {!pub.is_approved && (
                      <button 
                        onClick={() => handleApprove(pub.id)}
                        className="btn-primary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {publishers.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No publishers found.</td>
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
