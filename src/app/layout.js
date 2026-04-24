import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import AuthGuard from "@/components/AuthGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StoreGram Admin",
  description: "Admin panel for StoreGram platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ display: 'flex', backgroundColor: 'var(--bg-primary)' }}>
        <AuthGuard>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthGuard>
      </body>
    </html>
  );
}
