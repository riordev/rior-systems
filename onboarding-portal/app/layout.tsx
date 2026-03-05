import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rior Systems — Client Onboarding",
  description: "Connect your store and get your profit dashboard in 24-48 hours.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-slate-900 text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
