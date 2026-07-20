"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function ChatLayout({ children }) {
  return (
    <div className="app-container">


      {/* Main Interface */}
      <main className="main-content">
        <div className="built-by-badge">Built by Ambuj Kumar Tripathi</div>
        {children}
      </main>
    </div>
  );
}
