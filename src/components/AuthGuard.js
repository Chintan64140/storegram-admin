'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = Cookies.get('adminToken');
    const userStr = Cookies.get('adminUser');
    
    if (!token || !userStr) {
      if (pathname !== '/login') {
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'ADMIN') {
        router.push('/login');
      } else {
        if (pathname === '/login') {
          router.push('/');
        } else {
          setIsAuthorized(true);
        }
      }
    } catch (e) {
      router.push('/login');
    }
  }, [pathname, router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm font-medium text-accent">Loading...</p>
      </div>
    );
  }

  return children;
}
