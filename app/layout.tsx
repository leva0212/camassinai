"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 240,
          background: "#1f2937",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          padding: "20px 10px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>ERP</h2>
        <nav style={{ flexGrow: 1 }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ margin: "10px 0" }}>
              <Link href="/dashboard/productos" style={{ color: "#fff" }}>
                Productos
              </Link>
            </li>
            <li style={{ margin: "10px 0" }}>
              <Link href="/dashboard/inventarios" style={{ color: "#fff" }}>
                Inventarios
              </Link>
            </li>
            <li style={{ margin: "10px 0" }}>
              <Link href="/dashboard/reportes" style={{ color: "#fff" }}>
                Reportes
              </Link>
            </li>
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            border: "none",
            color: "#fff",
            padding: "10px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Contenido */}
      <div style={{ flexGrow: 1, padding: 20, background: "#f4f6f8" }}>
        {children}
      </div>
    </div>
  );
}