import type { Metadata } from "next";
import type React from "react";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Aprosoft Team Crud",
  description: "Team Management CRUD Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          {children}
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
