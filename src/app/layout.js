import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import AuthGuard from "@/components/AuthGuard";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StoreGram Admin",
  description: "Admin panel for StoreGram platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}
      >
        <AuthGuard>
          <LayoutWrapper>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </LayoutWrapper>
        </AuthGuard>
      </body>
    </html>
  );
}
