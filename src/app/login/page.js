'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import Cookies from 'js-cookie';
import api from '@/utils/api';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      if (user.role !== 'ADMIN') {
        setError('Unauthorized: Admin access required.');
        setLoading(false);
        return;
      }

      Cookies.set('adminToken', token, { expires: 7 });
      Cookies.set('adminUser', JSON.stringify(user), { expires: 7 });
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(0,160,254,0.18),_transparent_35%),linear-gradient(180deg,_#0a0a0a_0%,_#070707_100%)] px-6">
      <div className="card w-full max-w-sm border-white/10 bg-surface/95 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-sm">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-muted">Admin Portal</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-accent">
            StoreGram Admin
          </h1>
          <p className="mt-3 text-sm text-muted">
            Sign in to manage publishers, files, storage, and withdrawals.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-border bg-surface-strong px-4 py-3 text-sm text-foreground transition placeholder:text-muted/70 focus:border-accent"
              placeholder="admin@storegram.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-xl border border-border bg-surface-strong px-4 py-3 text-sm text-foreground transition placeholder:text-muted/70 focus:border-accent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary mt-2 w-full rounded-xl px-4 py-3 text-sm"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
