import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Queue Manager",
  description:
    "Distributed task queue management system with real-time monitoring and analytics",
  keywords: [
    "task queue",
    "job processing",
    "distributed systems",
    "monitoring",
    "analytics",
  ],
  authors: [{ name: "Salam Aziz" }],
  creator: "Salam Aziz",
  publisher: "Salam Aziz",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Task Queue Manager",
    description: "Professional distributed task queue management system",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Task Queue Manager",
    description: "Professional distributed task queue management system",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="font-sans antialiased bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="min-h-screen">{children}</div>
        <div id="portal-root" />
      </body>
    </html>
  );
}
