import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DataGuard.ai | Autonomous Cloud Security Posture Management",
  description: "Detect and remediate cloud vulnerabilities automatically with AI. Secure your AWS, Azure, and GCP infrastructure in real-time.",
  keywords: ["Cloud Security", "CSPM", "AI Security", "Terraform Remediation", "AWS Security"],
  authors: [{ name: "DataGuard Team" }],
  openGraph: {
    title: "DataGuard.ai",
    description: "Autonomous Cloud Security Powered by AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
