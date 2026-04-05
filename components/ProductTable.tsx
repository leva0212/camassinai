"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Modal from "@/components/ui/Modal";
import ProductEditModal from "@/components/ProductEditModal";


interface Producto {
  prod_id: number;
  prod_nombre: string;
  prod_precio: number | null;
  prod_activo: boolean;
  prod_cat_nombre?: string;
}

export function ProductTable({ refresh }: { refresh?: boolean }) {
  const [productoEditando, setProductoEditando] = useState<any>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [editProducto, setEditProducto] = useState<Producto | null>(null);

  const cargar = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("productos")
      .select(`
        prod_id,
        prod_nombre,
        prod_precio,
        prod_activo,
        productos_categorias (
          prod_cat_nombre
        )
      `)
      .order("prod_fechacreacion", { ascending: false });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    const lista = (data || []).map((p: any) => ({
      prod_id: p.prod_id,
      prod_nombre: p.prod_nombre,
      prod_precio: p.prod_precio,
      prod_activo: p.prod_activo,
      prod_cat_nombre: p.productos_categorias?.prod_cat_nombre
    }));

    setProductos(lista);
  };

  useEffect(() => {
    cargar();
  }, [refresh]);

  if (loading) return <div style={{ padding: 20 }}>Cargando...</div>;

  return (
    <>
      <div style={box}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f4f6f8" }}>
            <tr>
              <th style={th}>Producto</th>
              <th style={th}>Categoría</th>
              <th style={th}>Precio</th>
              <th style={th}>Activo</th>
              <th style={th}></th>
            </tr>
          </thead>

          <tbody>
            {productos.map((p) => (
              <tr key={p.prod_id} style={{ borderTop: "1px solid #eee" }}>
                <td style={td}>{p.prod_nombre}</td>
                <td style={td}>{p.prod_cat_nombre || "-"}</td>
                <td style={td}>
                  ₡ {Number(p.prod_precio || 0).toLocaleString("es-CR")}
                </td>
                <td style={td}>{p.prod_activo ? "Sí" : "No"}</td>

                <td style={td}>
                  <button
                    onClick={() => setEditProducto(p)}
                    style={btn}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!editProducto}
        onClose={() => setEditProducto(null)}
        title="Editar producto"
      >
        {editProducto && (
          <ProductEditModal
            producto={editProducto}
            onSaved={cargar}
            onClose={() => setEditProducto(null)}
          />
        )}
      </Modal>
    </>
  );
}

const box = {
  background: "#fff",
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  overflow: "hidden"
};

const th = { textAlign: "left" as const, padding: 12 };
const td = { padding: 12 };

const btn = {
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6
};