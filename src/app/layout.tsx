import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrderCare",
  description: "Smart inventory and order management platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 antialiased">
        {children}
      </body>
    </html>
  );
}
