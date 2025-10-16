import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/providers/web3-provider";

export const metadata: Metadata = {
  title: "Kleva",
  description: "Your Crypto Payment Gateway",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
