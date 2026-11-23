import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Junto | Realtime Operations & Analytics",
  description: "Production-ready Dark Mode Operations & Telemetry Dashboard for the Junto Verified College Network",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-canvas text-gray-100 min-h-screen antialiased selection:bg-junto-indigo selection:text-white">
        {children}
      </body>
    </html>
  );
}
