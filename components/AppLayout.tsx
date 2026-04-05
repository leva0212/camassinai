"use client";

import { useState, ReactNode } from "react";
import { ProductForm } from "@/components/ProductForm";
import { ProductTable } from "@/components/ProductTable";

type Page = "productos" | "inventario" | "personas";

type Props = {
  children?: ReactNode;
};

export default function AppLayout({ children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [page, setPage] = useState<Page>("productos");

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const go = (p: Page) => {
    setPage(p);
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      
      {/* SIDEBAR */}
      <div
        style={{
          width: drawerOpen ? 240 : 70,
          transition: "0.25s",
          background: "#111827",
          color: "#fff",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            padding: 20,
            fontWeight: 600,
            borderBottom: "1px solid #1f2937"
          }}
        >
          {drawerOpen ? "Camas Sinai" : "CS"}
        </div>

        <MenuItem
          icon="📦"
          label="Productos"
          open={drawerOpen}
          onClick={() => go("productos")}
        />

        <MenuItem
          icon="📊"
          label="Inventario"
          open={drawerOpen}
          onClick={() => go("inventario")}
        />

        <MenuItem
          icon="👤"
          label="Personas"
          open={drawerOpen}
          onClick={() => go("personas")}
        />
      </div>

      {/* CONTENIDO */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* APPBAR */}
        <div
          style={{
            height: 56,
            background: "#4f46e5",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            color: "#fff",
            fontWeight: 600
          }}
        >
          <button
            onClick={toggleDrawer}
            style={{
              fontSize: 22,
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              marginRight: 16
            }}
          >
            ☰
          </button>

          Sistema de Control
        </div>

        {/* PAGE */}
        <div
          style={{
            padding: 20,
            background: "#f3f4f6",
            flex: 1,
            overflow: "auto"
          }}
        >
          {page === "productos" && (
            <>
              <ProductForm />
              <div style={{ height: 20 }} />
              <ProductTable />
            </>
          )}

          {page === "inventario" && (
            <div>Inventario próximamente</div>
          )}

          {page === "personas" && (
            <div>Personas próximamente</div>
          )}

          {/* contenido que venga desde Plasmic */}
          {children}
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  open,
  onClick
}: {
  icon: string;
  label: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "14px 20px",
        cursor: "pointer",
        borderBottom: "1px solid #1f2937"
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>

      {open && <span style={{ marginLeft: 12 }}>{label}</span>}
    </div>
  );
}