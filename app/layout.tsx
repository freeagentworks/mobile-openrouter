import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/bottom-nav";
import { metadata, viewport } from "./metadata";

const inter = Inter({ subsets: ["latin"] });

export { metadata, viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <BottomNav />
        <main className="md:ml-64">
          {children}
        </main>
      </body>
    </html>
  );
}
