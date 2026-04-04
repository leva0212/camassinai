"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Categoria {
  prod_cat_nombre: string;
}

interface Producto {
  prod_id: number;
  prod_nombre: string;
  prod_precio: number | null;
  prod_activo: boolean;
  categoria?: Categoria | null;
}

interface ProductTableProps {
  refresh?: boolean;
}

export function ProductTable({ refresh }: ProductTableProps) {

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);

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
      .order("prod_fechaCreacion", { ascending: false });

    setLoading(false);

    if (error) {
      alert("Error cargando productos: " + error.message);
      return;
    }

    if (data) {

      const productosTransformados: Producto[] = data.map((p: any) => ({
        prod_id: p.prod_id,
        prod_nombre: p.prod_nombre,
        prod_precio: p.prod_precio,
        prod_activo: p.prod_activo,
        categoria: p.productos_categorias?.[0] || null
      }));

      setProductos(productosTransformados);
    }
  };

  useEffect(() => {
    cargar();
  }, [refresh]);

  const eliminar = async (id: number) => {

    const confirmar = confirm("¿Eliminar producto?");
    if (!confirmar) return;

    const { error } = await supabase
      .from("productos")
      .delete()
      .eq("prod_id", id);

    if (error) {
      alert("Error eliminando producto: " + error.message);
      return;
    }

    cargar();
  };

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        Cargando productos...
      </div>
    );
  }

  return (

    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        overflow: "hidden"
      }}
    >

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >

        <thead
          style={{
            background: "#f4f6f8"
          }}
        >

          <tr>
            <th style={th}>Producto</th>
            <th style={th}>Categoría</th>
            <th style={th}>Precio</th>
            <th style={th}>Activo</th>
            <th style={th}></th>
          </tr>

        </thead>

        <tbody>

          {productos.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: 20, textAlign: "center" }}>
                No hay productos
              </td>
            </tr>
          )}

          {productos.map((p) => (

            <tr
              key={p.prod_id}
              style={{
                borderTop: "1px solid #eee"
              }}
            >

              <td style={td}>
                {p.prod_nombre}
              </td>

              <td style={td}>
                {p.categoria?.prod_cat_nombre || "-"}
              </td>

              <td style={td}>
                ₡ {Number(p.prod_precio || 0).toLocaleString("es-CR")}
              </td>

              <td style={td}>
                {p.prod_activo ? "Sí" : "No"}
              </td>

              <td style={td}>

                <button
                  onClick={() => eliminar(p.prod_id)}
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: 6,
                    cursor: "pointer"
                  }}
                >
                  Eliminar
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

const th = {
  textAlign: "left" as const,
  padding: "12px",
  fontWeight: 600,
  fontSize: 14
};

const td = {
  padding: "12px",
  fontSize: 14
};