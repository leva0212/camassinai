"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Modal from "@/components/ui/Modal";
import ProductEditModal from "@/components/ProductEditModal";

import {
  MaterialReactTable,
  MRT_ColumnDef,
} from "material-react-table";

interface Producto {
  prod_id: number;
  prod_nombre: string;
  prod_precio: number | null;
  prod_activo: boolean;
  prod_cat_nombre?: string;
}

export function ProductTable({ refresh }: { refresh?: boolean }) {
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

    const lista: Producto[] = (data || []).map((p: any) => ({
      prod_id: p.prod_id,
      prod_nombre: p.prod_nombre,
      prod_precio: p.prod_precio,
      prod_activo: p.prod_activo,
      prod_cat_nombre: p.productos_categorias?.prod_cat_nombre,
    }));

    setProductos(lista);
  };

  useEffect(() => {
    cargar();
  }, [refresh]);

  // COLUMNAS MRT
  const columns = useMemo<MRT_ColumnDef<Producto>[]>(
    () => [
      {
        accessorKey: "prod_nombre",
        header: "Producto",
      },
      {
        accessorKey: "prod_cat_nombre",
        header: "Categoría",
      },
      {
        accessorKey: "prod_precio",
        header: "Precio",
        Cell: ({ cell }) =>
          `₡ ${Number(cell.getValue<number>() || 0).toLocaleString("es-CR")}`,
      },
      {
        accessorKey: "prod_activo",
        header: "Activo",
        Cell: ({ cell }) => (cell.getValue<boolean>() ? "Sí" : "No"),
      },
    ],
    []
  );

  if (loading) return <div style={{ padding: 20 }}>Cargando...</div>;

  return (
    <>
      <div style={box}>
        <MaterialReactTable
          columns={columns}
          data={productos}
          enableColumnFilters
          enableSorting
          enablePagination
          enableDensityToggle
          enableColumnOrdering
          enableColumnResizing
          enableHiding
          muiTableBodyRowProps={({ row }) => ({
            onDoubleClick: () => setEditProducto(row.original),
            sx: { cursor: "pointer" },
          })}
          renderRowActions={({ row }) => (
            <button
              style={btn}
              onClick={() => setEditProducto(row.original)}
            >
              Editar
            </button>
          )}
        />
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
  overflow: "hidden",
};

const btn = {
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};