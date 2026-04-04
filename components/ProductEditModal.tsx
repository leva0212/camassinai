"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
};

type Props = {
  producto: Producto;
  onSaved: () => void;
};

export default function ProductEditModal({ producto, onSaved }: Props) {

  const [nombre, setNombre] = useState<string>(producto?.nombre || "");
  const [precio, setPrecio] = useState<string>(
    producto?.precio ? String(producto.precio) : ""
  );

  const [loading, setLoading] = useState(false);

  const guardar = async () => {

    // VALIDACIONES

    if (!nombre.trim()) {
      alert("El nombre del producto es obligatorio");
      return;
    }

    if (!precio.trim()) {
      alert("El precio es obligatorio");
      return;
    }

    const precioNumero = Number(precio);

    if (isNaN(precioNumero) || precioNumero < 0) {
      alert("El precio debe ser un número válido");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("productos")
      .update({
        nombre: nombre.trim(),
        precio: precioNumero
      })
      .eq("id", producto.id);

    setLoading(false);

    if (error) {
      alert("Error al actualizar: " + error.message);
      return;
    }

    alert("Producto actualizado correctamente");

    onSaved();
  };

  return (

    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 10,
        width: 400,
        maxWidth: "100%"
      }}
    >

      <h3 style={{ marginBottom: 20 }}>
        Editar Producto
      </h3>

      {/* NOMBRE */}

      <div style={{ marginBottom: 15 }}>

        <label style={{ display: "block", marginBottom: 5 }}>
          Nombre
        </label>

        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ddd"
          }}
        />

      </div>

      {/* PRECIO */}

      <div style={{ marginBottom: 20 }}>

        <label style={{ display: "block", marginBottom: 5 }}>
          Precio
        </label>

        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ddd"
          }}
        />

      </div>

      {/* BOTÓN */}

      <button
        onClick={guardar}
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          background: "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Guardando..." : "Guardar Cambios"}
      </button>

    </div>

  );
}