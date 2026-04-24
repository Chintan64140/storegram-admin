'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, UserCheck, HardDrive, FileText, CreditCard, LogOut, Eye } from 'lucide-react';
import Cookies from 'js-cookie';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/login') return null;

  const handleLogout = () => {
    Cookies.remove('adminToken');
    router.push('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Publishers', path: '/publishers', icon: UserCheck },
    { name: 'Files', path: '/files', icon: FileText },
    { name: 'Storage', path: '/storage', icon: HardDrive },
    { name: 'Transactions', path: '/withdrawals', icon: CreditCard },
    { name: 'Views', path: '/views', icon: Eye },
  ];

  return (
    <div style={{ width: '250px', backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', height: '100vh', position: 'fixed', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ color: 'var(--accent-blue)', margin: 0 }}>StoreGram Admin</h2>
      </div>
      <div style={{ padding: '20px', flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
            return (
              <li key={item.path} style={{ marginBottom: '10px' }}>
                <Link href={item.path} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  borderRadius: '6px',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--accent-blue)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                }}>
                  <Icon size={20} style={{ marginRight: '10px' }} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', color: 'var(--danger)', width: '100%', padding: '10px', borderRadius: '6px' }}>
          <LogOut size={20} style={{ marginRight: '10px' }} />
          Logout
        </button>
      </div>
    </div>
  );
}
