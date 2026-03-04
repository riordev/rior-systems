import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Rior Systems | Admin Panel",
  description: "Profit Intelligence Systems for Shopify Brands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="gradient-bg" />
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-20 lg:ml-72 p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
