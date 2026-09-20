import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scouting Platform",
  description: "Kişisel futbolcu scouting ve analiz platformu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-slate-800 bg-slate-950/60 px-6 py-4">
            <h1 className="text-xl font-semibold text-slate-100">
              ⚽ Scouting Platform
            </h1>
            <p className="text-sm text-slate-400">
              2004+ doğumlu oyuncular · CIES-esintili index
            </p>
          </header>
          <main className="px-6 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
