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
    Cookies.remove('adminUser');
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
    <aside className="fixed inset-y-0 left-0 hidden w-[250px] flex-col border-r border-border bg-surface md:flex">
      <div className="border-b border-border px-5 py-6">
        <h2 className="text-xl font-semibold tracking-tight text-accent">StoreGram Admin</h2>
      </div>
      <div className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-accent text-white shadow-[0_10px_30px_rgba(0,160,254,0.22)]'
                      : 'text-muted hover:bg-white/5 hover:text-foreground'
                  }`}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="border-t border-border px-4 py-5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-danger transition hover:bg-danger/10"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
