'use client';
import Loader from '@/components/Loader';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Plus, Minus } from 'lucide-react';
import { formatMB, getStorageTotalMB, getStorageUsedMB } from '@/utils/format';
import PaginationControls from '@/components/PaginationControls';

export default function Storage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      setError('');
      const response = await api.get('/admin/users', { params: { page, limit } });
      setUsers(response.data.data || []);
      setPagination(response.data.pagination || null);
    } catch (err) {
      console.error('Error fetching users', err);
      setError(err.response?.data?.error || 'Failed to load storage users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchUsers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [page, limit]);

  const handleStorageChange = async (userId, additionalMB) => {
    const action = additionalMB > 0 ? 'increase' : 'decrease';
    if (!window.confirm(`Are you sure you want to ${action} this user's storage by ${Math.abs(additionalMB)} MB?`)) return;
    
    try {
      await api.post(`/admin/storage/${action}`, { userId, additionalMB: Math.abs(additionalMB) });
      setMessage(`Storage ${action}d successfully.`);
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${action} storage.`);
    }
  };

  if (loading) return <Loader text="Loading storage allocations..." />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Storage Management</h1>

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
              <th>Role</th>
              <th>Storage Used (MB)</th>
              <th>Storage Limit (MB)</th>
              <th>Usage %</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const used = getStorageUsedMB(user);
              const total = getStorageTotalMB(user) || 1;
              const usagePercent = Math.min(100, (used / total) * 100);

              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{formatMB(used)}</td>
                  <td>{formatMB(total, 0)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, backgroundColor: 'var(--border-color)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${usagePercent}%`, 
                          backgroundColor: usagePercent > 90 ? 'var(--danger)' : 'var(--accent-blue)', 
                          height: '100%' 
                        }}></div>
                      </div>
                      <span style={{ fontSize: '0.8rem' }}>{usagePercent.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleStorageChange(user.id, 5000)} // +5GB
                        className="btn-primary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Plus size={14} /> 5GB
                      </button>
                      <button 
                        onClick={() => handleStorageChange(user.id, -5000)} // -5GB
                        className="btn-danger"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Minus size={14} /> 5GB
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No users found.</td>
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
