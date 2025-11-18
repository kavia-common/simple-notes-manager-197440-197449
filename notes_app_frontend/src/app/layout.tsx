import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";

export const metadata: Metadata = {
  title: "Ocean Notes",
  description: "A simple notes application with a modern Ocean Professional theme.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen app-shell text-gray-900" suppressHydrationWarning>
        <div className="min-h-screen flex">
          {/* Sidebar (fixed on mobile, static on md+) */}
          <Sidebar />

          {/* Main area */}
          <div className="flex-1 md:ml-0 md:pl-0 md:flex md:flex-col" style={{ marginLeft: "0" }}>
            <Header />
            <main className="mx-auto w-full max-w-6xl px-4 md:px-6 py-6">
              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
