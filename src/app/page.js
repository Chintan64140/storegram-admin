'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Users, FileText, Eye, CreditCard, HardDrive, BarChart3, Wallet, UserCheck } from 'lucide-react';
import AdminBarChart from '@/components/AdminBarChart';
import { formatCurrency, formatMB } from '@/utils/format';

export default function Dashboard() {
  const [data, setData] = useState({
    totalUsers: 0,
    totalFiles: 0,
    totalViews: 0,
    totalTransactions: 0,
    pendingWithdrawals: 0,
    completedWithdrawals: 0,
    rejectedWithdrawals: 0,
    approvedPublishers: 0,
    pendingPublishers: 0,
    platformStorageUsedMB: 0,
    totalPayoutAmount: 0,
    withdrawalChart: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setError('');
      const response = await api.get('/admin/analytics/dashboard');
      setData(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
      setError(err.response?.data?.error || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchDashboard();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  const statCards = [
    { title: 'Total Users', value: data.totalUsers, icon: Users, color: '#00A0FE' },
    { title: 'Total Files', value: data.totalFiles, icon: FileText, color: '#00cc66' },
    { title: 'Total Views', value: data.totalViews, icon: Eye, color: '#ffcc00' },
    { title: 'Pending Withdrawals', value: data.pendingWithdrawals, icon: CreditCard, color: '#ff4d4d' },
    { title: 'Completed Withdrawals', value: data.completedWithdrawals, icon: BarChart3, color: '#7dd3fc' },
    { title: 'Approved Publishers', value: data.approvedPublishers, icon: UserCheck, color: '#c084fc' },
    { title: 'Platform Storage', value: formatMB(data.platformStorageUsedMB), icon: HardDrive, color: '#a0a0a0' },
    { title: 'Total Payouts', value: formatCurrency(data.totalPayoutAmount), icon: Wallet, color: '#34d399' },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>

      {error && (
        <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'rgba(255, 77, 77, 0.3)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                backgroundColor: `${stat.color}20`, 
                padding: '1rem', 
                borderRadius: '50%', 
                marginRight: '1.5rem' 
              }}>
                <Icon size={32} color={stat.color} />
              </div>
              <div>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>{stat.title}</h3>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ marginBottom: '0.35rem' }}>Withdrawal Activity</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Last 6 months of completed, pending, and rejected withdrawal requests.</p>
            </div>
          </div>
          <AdminBarChart data={data.withdrawalChart || []} />
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>Quick Totals</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)' }}>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>All Transactions</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 'bold' }}>{data.totalTransactions}</div>
            </div>
            <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)' }}>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Rejected Withdrawals</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 'bold' }}>{data.rejectedWithdrawals}</div>
            </div>
            <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)' }}>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Pending Publisher Approvals</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 'bold' }}>{data.pendingPublishers}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
