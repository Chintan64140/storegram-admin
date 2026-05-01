'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Loader from './Loader';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const clearAdminSession = () => {
    Cookies.remove('adminToken');
    Cookies.remove('adminUser');
  };

  useEffect(() => {
    const token = Cookies.get('adminToken');
    const userStr = Cookies.get('adminUser');
    
    if (!token || !userStr) {
      if (pathname !== '/login') {
        clearAdminSession();
        router.replace('/login');
      } else {
        setIsAuthorized(true);
      }
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'ADMIN') {
        clearAdminSession();
        router.replace('/login');
      } else {
        if (pathname === '/login') {
          router.replace('/');
        } else {
          setIsAuthorized(true);
        }
      }
    } catch {
      clearAdminSession();
      router.replace('/login');
    }
  }, [pathname, router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader text="Loading..." />
      </div>);
  }

  return children;
}
