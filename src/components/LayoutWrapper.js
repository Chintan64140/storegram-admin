'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="min-h-screen w-full bg-background">
      <Sidebar />
      <main
        className={
          isLoginPage
            ? 'min-h-screen w-full'
            : 'min-h-screen w-full md:pl-[250px]'
        }
      >
        <div className={isLoginPage ? 'min-h-screen' : 'min-h-screen p-4 md:p-8'}>
          {children}
        </div>
      </main>
    </div>
  );
}
