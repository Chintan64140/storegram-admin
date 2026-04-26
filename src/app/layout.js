import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import AuthGuard from "@/components/AuthGuard";
import { Suspense } from "react";
import Loader from "@/components/Loader";

export const metadata = {
  title: "StoreGram Admin",
  description: "Admin panel for StoreGram platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthGuard>
          <LayoutWrapper>
            <Suspense fallback={<Loader />}>{children}</Suspense>
          </LayoutWrapper>
        </AuthGuard>
      </body>
    </html>
  );
}
