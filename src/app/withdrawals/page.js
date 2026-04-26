'use client';
import Loader from '@/components/Loader';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { CheckCircle, XCircle, CreditCard, Wallet, Clock3 } from 'lucide-react';
import { formatCurrency, formatDateTime, formatTransactionAmount } from '@/utils/format';
import PaginationControls from '@/components/PaginationControls';

export default function Withdrawals() {
  const [transactions, setTransactions] = useState([]);
  const [transactionsPagination, setTransactionsPagination] = useState(null);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsLimit, setTransactionsLimit] = useState(20);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingPagination, setPendingPagination] = useState(null);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingLimit, setPendingLimit] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchTransactions = async () => {
    try {
      setError('');
      const [transactionsResponse, pendingResponse] = await Promise.all([
        api.get('/admin/transactions', { params: { page: transactionsPage, limit: transactionsLimit } }),
        api.get('/admin/withdraw/requests', { params: { page: pendingPage, limit: pendingLimit } }),
      ]);
      setTransactions(transactionsResponse.data.data || []);
      setTransactionsPagination(transactionsResponse.data.pagination || null);
      setPendingRequests(pendingResponse.data.data || []);
      setPendingPagination(pendingResponse.data.pagination || null);
    } catch (err) {
      console.error('Error fetching transactions', err);
      setError(err.response?.data?.error || 'Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchTransactions();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [transactionsPage, transactionsLimit, pendingPage, pendingLimit]);

  const handleAction = async (transactionId, status) => {
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) return;
    try {
      if (status === 'APPROVED') {
        await api.post('/admin/withdraw/approve', { transactionId, status });
      } else {
        await api.post('/admin/withdraw/reject', { transactionId, status });
      }
      setMessage(`Transaction ${status.toLowerCase()} successfully.`);
      await fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${status.toLowerCase()} request.`);
    }
  };

  if (loading) return <Loader text="Loading withdrawals..." />;

  const approvedWithdrawals = transactions.filter((transaction) => transaction.status === 'APPROVED' && Number(transaction.amount) < 0);
  const approvedPayoutAmount = approvedWithdrawals.reduce((sum, transaction) => sum + Math.abs(Number(transaction.amount || 0)), 0);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Transactions & Withdrawals</h1>

      {(error || message) && (
        <div className="card" style={{ marginBottom: '1.5rem', borderColor: error ? 'rgba(255, 77, 77, 0.3)' : 'rgba(0, 204, 102, 0.3)', color: error ? 'var(--danger)' : 'var(--success)' }}>
          {error || message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock3 size={22} color="#ffa500" />
            <div>
              <div style={{ color: 'var(--text-secondary)' }}>Pending Requests</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pendingPagination?.totalItems ?? pendingRequests.length}</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CreditCard size={22} color="var(--accent-blue)" />
            <div>
              <div style={{ color: 'var(--text-secondary)' }}>All Transactions</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{transactionsPagination?.totalItems ?? transactions.length}</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Wallet size={22} color="var(--success)" />
            <div>
              <div style={{ color: 'var(--text-secondary)' }}>Approved Payouts (This Page)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(approvedPayoutAmount)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Pending Withdrawal Requests</h2>
        <table>
          <thead>
            <tr>
              <th>Publisher</th>
              <th>Email</th>
              <th>Role</th>
              <th>Amount</th>
              <th>Wallet</th>
              <th>Reference Details</th>
              <th>Requested</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.users?.name || 'Unknown'}</td>
                <td>{req.users?.email || 'N/A'}</td>
                <td>{req.users?.role || 'N/A'}</td>
                <td style={{ fontWeight: 'bold' }}>{formatTransactionAmount(req.amount)}</td>
                <td>{formatCurrency(req.users?.wallet_balance)}</td>
                <td>{req.reference_id || 'N/A'}</td>
                <td>{formatDateTime(req.created_at)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleAction(req.id, 'APPROVED')}
                      className="btn-success"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'REJECTED')}
                      className="btn-danger"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pendingRequests.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No pending withdrawal requests.</td>
              </tr>
            )}
          </tbody>
        </table>
        <PaginationControls
          pagination={pendingPagination}
          onPageChange={setPendingPage}
          onLimitChange={(nextLimit) => {
            setPendingLimit(nextLimit);
            setPendingPage(1);
          }}
        />
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <h2 style={{ marginBottom: '1rem' }}>All Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Amount</th>
              <th>Reference</th>
              <th>Status</th>
              <th>Wallet</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.users?.name || 'Unknown'}</td>
                <td>{transaction.users?.email || 'N/A'}</td>
                <td>{transaction.users?.role || 'N/A'}</td>
                <td style={{ fontWeight: 'bold', color: Number(transaction.amount) < 0 ? 'var(--danger)' : 'var(--success)' }}>
                  {formatTransactionAmount(transaction.amount)}
                </td>
                <td>{transaction.reference_id || 'N/A'}</td>
                <td>
                  <span className={`badge ${transaction.status === 'APPROVED' ? 'badge-success' : transaction.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                    {transaction.status}
                  </span>
                </td>
                <td>{formatCurrency(transaction.users?.wallet_balance)}</td>
                <td>{formatDateTime(transaction.created_at)}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <PaginationControls
          pagination={transactionsPagination}
          onPageChange={setTransactionsPage}
          onLimitChange={(nextLimit) => {
            setTransactionsLimit(nextLimit);
            setTransactionsPage(1);
          }}
          limitOptions={[10, 20, 50, 100]}
        />
      </div>
    </div>
  );
}
