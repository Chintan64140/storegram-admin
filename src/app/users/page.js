'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Ban, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate, formatMB, getStorageTotalMB, getStorageUsedMB } from '@/utils/format';
import PaginationControls from '@/components/PaginationControls';

export default function Users() {
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
      setError(err.response?.data?.error || 'Failed to load users.');
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

  const handleBlockToggle = async (userId, currentlyApproved) => {
    if (!window.confirm(`Are you sure you want to ${currentlyApproved ? 'block' : 'unblock'} this user?`)) return;
    try {
      // isBlocked means we want to block them, which means they are currently approved
      await api.post('/admin/users/block', { userId, isBlocked: currentlyApproved });
      setMessage(`User ${currentlyApproved ? 'blocked' : 'unblocked'} successfully.`);
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user status.');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.post('/admin/users/change-role', { userId, role: newRole });
      setMessage('Role updated successfully.');
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update role.');
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>User Management</h1>

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
              <th>Mobile</th>
              <th>Role</th>
              <th>Wallet</th>
              <th>Storage Used</th>
              <th>Storage Total</th>
              <th>Referral Code</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.mobile || 'N/A'}</td>
                <td>
                  <select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    style={{ padding: '0.25rem' }}
                  >
                    <option value="VIEWER">Viewer</option>
                    <option value="PUBLISHER">Publisher</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td>{formatCurrency(user.wallet_balance)}</td>
                <td>{formatMB(getStorageUsedMB(user))}</td>
                <td>{formatMB(getStorageTotalMB(user), 0)}</td>
                <td>{user.referral_code || 'N/A'}</td>
                <td>
                  {user.is_approved ? (
                    <span className="badge badge-success">Active</span>
                  ) : (
                    <span className="badge badge-danger">Blocked/Pending</span>
                  )}
                </td>
                <td>{formatDate(user.created_at)}</td>
                <td>
                  <button 
                    onClick={() => handleBlockToggle(user.id, user.is_approved)}
                    className={user.is_approved ? "btn-danger" : "btn-primary"}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    {user.is_approved ? <><Ban size={14} /> Block</> : <><CheckCircle size={14} /> Unblock</>}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="11" style={{ textAlign: 'center' }}>No users found.</td>
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
