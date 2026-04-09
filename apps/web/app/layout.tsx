import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Progressive Overload",
  description: "Exercise tracking dashboard for workout history and progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
