import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import "../styles/globals.scss";
import Navbar from "@/components/Navbar/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NFT Airdrop",
  description: "NFT Airdrop",
};

export default function ({ children }: React.PropsWithChildren) {
  const connectSid = cookies().get("connect.sid");

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider connectSid={connectSid}>
          <Navbar connectSid={connectSid} />
          <main className="container">
            <div className="w-full h-screen">{children}</div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
