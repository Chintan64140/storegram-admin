'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        marginLeft: isLoginPage ? '0' : '250px', 
        minHeight: '100vh', 
        padding: isLoginPage ? '0' : '2rem' 
      }}>
        {children}
      </main>
    </>
  );
}
