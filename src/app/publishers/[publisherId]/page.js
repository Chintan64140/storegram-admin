'use client';
import Loader from '@/components/Loader';


import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/api';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatMB,
  formatTransactionAmount,
  getStorageTotalMB,
  getStorageUsedMB,
} from '@/utils/format';
import PaginationControls from '@/components/PaginationControls';

export default function PublisherDetailsPage() {
  const params = useParams();
  const publisherId = params?.publisherId;
  const [data, setData] = useState({
    publisher: null,
    summary: null,
    files: { data: [], pagination: null },
    views: { data: [], pagination: null },
    transactions: { data: [], pagination: null },
    referredUsers: { data: [], pagination: null },
  });
  const [filesPage, setFilesPage] = useState(1);
  const [filesLimit, setFilesLimit] = useState(10);
  const [viewsPage, setViewsPage] = useState(1);
  const [viewsLimit, setViewsLimit] = useState(10);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsLimit, setTransactionsLimit] = useState(10);
  const [referredUsersPage, setReferredUsersPage] = useState(1);
  const [referredUsersLimit, setReferredUsersLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPublisherDetails = async () => {
    try {
      setError('');
      const response = await api.get(`/admin/publishers/${publisherId}`, {
        params: {
          filesPage,
          filesLimit,
          viewsPage,
          viewsLimit,
          transactionsPage,
          transactionsLimit,
          referredUsersPage,
          referredUsersLimit,
        },
      });
      setData(response.data);
    } catch (err) {
      console.error('Error fetching publisher details', err);
      setError(err.response?.data?.error || 'Failed to load publisher details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!publisherId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void fetchPublisherDetails();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [publisherId, filesPage, filesLimit, viewsPage, viewsLimit, transactionsPage, transactionsLimit, referredUsersPage, referredUsersLimit]);

  if (loading) return <Loader text="Loading publisher details..." />;

  if (error) {
    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/publishers">← Back to Publishers</Link>
        </div>
        <div className="card" style={{ borderColor: 'rgba(255, 77, 77, 0.3)', color: 'var(--danger)' }}>
          {error}
        </div>
      </div>
    );
  }

  const publisher = data.publisher;
  const summary = data.summary || {};

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ marginBottom: '0.5rem' }}>
            <Link href="/publishers">← Back to Publishers</Link>
          </div>
          <h1 style={{ marginBottom: '0.35rem' }}>{publisher?.name || 'Publisher Details'}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{publisher?.email || 'N/A'}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className={`badge ${publisher?.is_approved ? 'badge-success' : 'badge-warning'}`}>
            {publisher?.is_approved ? 'Approved' : 'Pending Approval'}
          </span>
          <span className="badge badge-success">{publisher?.role || 'PUBLISHER'}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Wallet Balance</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(publisher?.wallet_balance)}</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Storage Used</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatMB(getStorageUsedMB(publisher))}</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Storage Limit</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatMB(getStorageTotalMB(publisher), 0)}</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Referral Code</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{publisher?.referral_code || 'N/A'}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Uploaded Files</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{summary.totalFiles || 0}</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Tracked Views</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{summary.totalViews || 0}</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Valid Views</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{summary.validViews || 0}</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>File Earnings</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(summary.totalFileEarnings)}</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Approved Withdrawals</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{summary.approvedWithdrawals || 0}</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Approved Payouts</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(summary.approvedPayoutAmount)}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Publisher Profile</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Name</div>
            <div>{publisher?.name || 'N/A'}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Email</div>
            <div>{publisher?.email || 'N/A'}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Mobile</div>
            <div>{publisher?.mobile || 'N/A'}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Joined</div>
            <div>{formatDateTime(publisher?.created_at)}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Verified</div>
            <div>{publisher?.is_verified ? 'Yes' : 'No'}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Approved</div>
            <div>{publisher?.is_approved ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Reference</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions.data.map((transaction) => (
              <tr key={transaction.id}>
                <td style={{ fontWeight: 'bold', color: Number(transaction.amount) < 0 ? 'var(--danger)' : 'var(--success)' }}>
                  {formatTransactionAmount(transaction.amount)}
                </td>
                <td>{transaction.reference_id || 'N/A'}</td>
                <td>
                  <span className={`badge ${transaction.status === 'APPROVED' ? 'badge-success' : transaction.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                    {transaction.status}
                  </span>
                </td>
                <td>{formatDateTime(transaction.created_at)}</td>
              </tr>
            ))}
            {data.transactions.data.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <PaginationControls
          pagination={data.transactions.pagination}
          onPageChange={setTransactionsPage}
          onLimitChange={(nextLimit) => {
            setTransactionsLimit(nextLimit);
            setTransactionsPage(1);
          }}
        />
      </div>

      <div className="card" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Uploaded Content</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Short ID</th>
              <th>Size</th>
              <th>Views</th>
              <th>Earnings</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {data.files.data.map((file) => (
              <tr key={file.id}>
                <td>{file.title || 'Untitled'}</td>
                <td>{file.short_id || 'N/A'}</td>
                <td>{formatMB((file.size || 0) / (1024 * 1024))}</td>
                <td>{file.total_views || 0}</td>
                <td>{formatCurrency(file.total_earnings)}</td>
                <td>{formatDate(file.created_at)}</td>
              </tr>
            ))}
            {data.files.data.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No uploaded content found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <PaginationControls
          pagination={data.files.pagination}
          onPageChange={setFilesPage}
          onLimitChange={(nextLimit) => {
            setFilesLimit(nextLimit);
            setFilesPage(1);
          }}
        />
      </div>

      <div className="card" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Views</h2>
        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Short ID</th>
              <th>Watch Time</th>
              <th>Valid</th>
              <th>Location</th>
              <th>IP Address</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {data.views.data.map((view) => (
              <tr key={view.id}>
                <td>{view.files?.title || 'Unknown File'}</td>
                <td>{view.files?.short_id || 'N/A'}</td>
                <td>{Number(view.watch_time || 0).toFixed(1)}s</td>
                <td>
                  <span className={`badge ${view.is_valid ? 'badge-success' : 'badge-warning'}`}>
                    {view.is_valid ? 'Valid' : 'Not Counted'}
                  </span>
                </td>
                <td>{view.location || 'Unknown'}</td>
                <td>{view.ip_address || 'Unknown'}</td>
                <td>{formatDateTime(view.created_at)}</td>
              </tr>
            ))}
            {data.views.data.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No views found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <PaginationControls
          pagination={data.views.pagination}
          onPageChange={setViewsPage}
          onLimitChange={(nextLimit) => {
            setViewsLimit(nextLimit);
            setViewsPage(1);
          }}
        />
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <h2 style={{ marginBottom: '1rem' }}>Referred Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {data.referredUsers.data.map((user) => (
              <tr key={user.id}>
                <td>{user.name || 'Unnamed User'}</td>
                <td>{user.email || 'N/A'}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`badge ${user.is_approved ? 'badge-success' : 'badge-warning'}`}>
                    {user.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td>{formatDateTime(user.created_at)}</td>
              </tr>
            ))}
            {data.referredUsers.data.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No referred users found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <PaginationControls
          pagination={data.referredUsers.pagination}
          onPageChange={setReferredUsersPage}
          onLimitChange={(nextLimit) => {
            setReferredUsersLimit(nextLimit);
            setReferredUsersPage(1);
          }}
        />
      </div>
    </div>
  );
}
