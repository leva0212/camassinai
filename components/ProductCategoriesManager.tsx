"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Categoria = {
  prod_cat_id: number;
  prod_cat_nombre: string;
};

export function ProductCategoriesManager() {

  const [nombre, setNombre] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {

    const { data, error } = await supabase
      .from("productos_categorias")
      .select("*")
      .order("prod_cat_nombre");

    if (error) {
      alert("Error cargando categorías: " + error.message);
      return;
    }

    setCategorias(data || []);
  };

  const limpiarFormulario = () => {
    setNombre("");
    setEditingId(null);
  };

  const guardar = async () => {

    if (!nombre.trim()) {
      alert("Ingrese nombre de categoría");
      return;
    }

    setLoading(true);

    if (editingId !== null) {

      const { error } = await supabase
        .from("productos_categorias")
        .update({
          prod_cat_nombre: nombre.trim()
        })
        .eq("prod_cat_id", editingId);

      if (error) {
        alert("Error actualizando categoría: " + error.message);
        setLoading(false);
        return;
      }

    } else {

      const { error } = await supabase
        .from("productos_categorias")
        .insert({
          prod_cat_nombre: nombre.trim()
        });

      if (error) {
        alert("Error creando categoría: " + error.message);
        setLoading(false);
        return;
      }

    }

    limpiarFormulario();
    setLoading(false);
    cargarCategorias();
  };

  const editar = (cat: Categoria) => {
    setNombre(cat.prod_cat_nombre);
    setEditingId(cat.prod_cat_id);
  };

  const eliminar = async (id: number) => {

    const confirmar = confirm("¿Eliminar categoría?");
    if (!confirmar) return;

    const { error } = await supabase
      .from("productos_categorias")
      .delete()
      .eq("prod_cat_id", id);

    if (error) {
      alert(
        "No se puede eliminar la categoría porque está siendo usada por productos."
      );
      return;
    }

    cargarCategorias();
  };

  return (

    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}
    >

      <h3 style={{ marginBottom: 15 }}>Categorías</h3>

      {/* FORM */}

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20
        }}
      >

        <input
          value={nombre}
          placeholder="Nombre de categoría"
          onChange={(e) => setNombre(e.target.value)}
          disabled={loading}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ddd",
            flex: 1
          }}
        />

        <button
          onClick={guardar}
          disabled={loading}
          style={{
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading
            ? "Guardando..."
            : editingId
            ? "Actualizar"
            : "Crear"}
        </button>

        {editingId && (

          <button
            onClick={limpiarFormulario}
            style={{
              background: "#e5e7eb",
              border: "none",
              padding: "10px 16px",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Cancelar
          </button>

        )}

      </div>

      {/* TABLA */}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >

        <thead>

          <tr style={{ background: "#f5f5f5" }}>

            <th style={{ padding: 10, textAlign: "left" }}>ID</th>
            <th style={{ padding: 10, textAlign: "left" }}>Nombre</th>
            <th style={{ padding: 10, textAlign: "center" }}>Acciones</th>

          </tr>

        </thead>

        <tbody>

          {categorias.length === 0 && (

            <tr>
              <td
                colSpan={3}
                style={{
                  padding: 20,
                  textAlign: "center"
                }}
              >
                No hay categorías
              </td>
            </tr>

          )}

          {categorias.map((cat) => (

            <tr
              key={cat.prod_cat_id}
              style={{
                borderTop: "1px solid #eee"
              }}
            >

              <td style={{ padding: 10 }}>
                {cat.prod_cat_id}
              </td>

              <td style={{ padding: 10 }}>
                {cat.prod_cat_nombre}
              </td>

              <td
                style={{
                  padding: 10,
                  display: "flex",
                  gap: 8,
                  justifyContent: "center"
                }}
              >

                <button
                  onClick={() => editar(cat)}
                  title="Editar categoría"
                  style={{
                    background: "transparent",
                    border: "none",
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    fontSize: 18,
                    color: "#f59e0b"
                  }}
                >
                  ✏️
                </button>

                <button
                  onClick={() => eliminar(cat.prod_cat_id)}
                  title="Eliminar categoría"
                  style={{
                    background: "transparent",
                    border: "none",
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    fontSize: 18,
                    color: "#ef4444"
                  }}
                >
                  🗑️
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}