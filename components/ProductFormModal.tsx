"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Categoria = {
  prod_cat_id: number;
  prod_cat_nombre: string;
};

type Producto = {
  prod_id?: number;
  prod_nombre: string;
  prod_precio: number | null;
  prod_cat_id: number | null;
  prod_activo?: boolean;
};

type Props = {
  producto?: Producto;
  onSaved?: () => void;
  onClose?: () => void;
};

export function ProductFormModal({ producto, onSaved, onClose }: Props) {

  const editando = !!producto;

  const [nombre, setNombre] = useState(producto?.prod_nombre || "");
  const [precio, setPrecio] = useState(
    producto?.prod_precio ? producto.prod_precio.toLocaleString("es-CR") : ""
  );

  const [categoria, setCategoria] = useState<number | null>(
    producto?.prod_cat_id || null
  );

  const [activo, setActivo] = useState(producto?.prod_activo ?? true);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
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

    const lista = data || [];

    setCategorias(lista);

    if (!editando && lista.length > 0) {
      setCategoria(lista[0].prod_cat_id);
    }

  };

  const formatearNumero = (valor: string) => {

    const limpio = valor.replace(/\./g, "").replace(/,/g, "");

    if (limpio === "") return "";

    const numero = Number(limpio);

    if (isNaN(numero)) return "";

    return numero.toLocaleString("es-CR");

  };

  const guardar = async () => {

    if (!nombre.trim()) {
      alert("El nombre del producto es obligatorio");
      return;
    }

    const precioNumero = precio ? Number(precio) : null;

    setLoading(true);

    if (editando) {

      const { error } = await supabase
        .from("productos")
        .update({
          prod_nombre: nombre.trim(),
          prod_precio: precioNumero,
          prod_cat_id: categoria,
          prod_activo: activo
        })
        .eq("prod_id", producto?.prod_id);

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

    } else {

      const { data, error } = await supabase
        .from("productos")
        .insert({
          prod_nombre: nombre.trim(),
          prod_precio: precioNumero,
          prod_cat_id: categoria
        })
        .select()
        .single();

      if (error) {
        alert("Error al crear producto: " + error.message);
        setLoading(false);
        return;
      }

      if (data) {

        await supabase
          .from("inventario")
          .insert({
            inv_prodid: data.prod_id,
            inv_disponible: 0,
            inv_reservado: 0
          });

      }

      setNombre("");
      setPrecio("");

      if (categorias.length > 0) {
        setCategoria(categorias[0].prod_cat_id);
      }

    }

    setLoading(false);
    onSaved?.();
    onClose?.();

  };

  return (

    <div style={overlay}>

      <div style={modal}>

        <h3 style={{ marginBottom: 20 }}>
          {editando ? "Editar producto" : "Crear producto"}
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxWidth: 300,
            margin: "0 auto",
            width: "100%"
          }}
        >

          {/* NOMBRE */}

          <div style={{ display: "flex", flexDirection: "column" }}>

            <label style={label}>Nombre producto</label>

            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={input}
            />

          </div>

          {/* PRECIO */}

          <div style={{ display: "flex", flexDirection: "column" }}>

            <label style={label}>Precio</label>

            <input
              value={precio}
             onChange={(e) => {
    const v = e.target.value.replace(/[^0-9]/g, "");
    setPrecio(v);
  }}
              style={input}
            />

          </div>

          {/* CATEGORIA */}

          <div style={{ display: "flex", flexDirection: "column" }}>

            <label style={label}>Categoría</label>

            <select
              value={categoria ?? ""}
              onChange={(e) =>
                setCategoria(Number(e.target.value))
              }
              style={input}
            >

              {categorias.map((c) => (

                <option
                  key={c.prod_cat_id}
                  value={c.prod_cat_id}
                >
                  {c.prod_cat_nombre}
                </option>

              ))}

            </select>

          </div>

          {/* ACTIVO SOLO EN EDICION */}

          {editando && (

            <label style={{ display: "flex", gap: 6 }}>

              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
              />

              Producto activo

            </label>

          )}

          {/* BOTONES */}

          <div style={{ display: "flex", gap: 10 }}>

            <button
              onClick={guardar}
              disabled={loading}
              style={botonPrincipal}
            >
              {loading
                ? "Guardando..."
                : editando
                ? "Actualizar"
                : "Crear"}
            </button>

            <button
              onClick={onClose}
              style={botonSecundario}
            >
              Cancelar
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

const overlay = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modal = {
  background: "#fff",
  padding: 25,
  borderRadius: 10,
  width: 380,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
};

const label = {
  fontSize: 13,
  marginBottom: 4,
  color: "#555"
};

const input = {
  padding: 8,
  borderRadius: 6,
  border: "1px solid #ddd"
};

const botonPrincipal = {
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
  height: 36
};

const botonSecundario = {
  background: "#e5e7eb",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
  height: 36
};