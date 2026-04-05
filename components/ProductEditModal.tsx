"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  producto: any;
  onSaved: () => void;
  onClose: () => void;
};

export default function ProductEditModal({
  producto,
  onSaved,
  onClose
}: Props) {
  const [nombre, setNombre] = useState(producto.prod_nombre);
  const [precio, setPrecio] = useState(producto.prod_precio || "");
  const [loading, setLoading] = useState(false);

  const guardar = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("productos")
      .update({
        prod_nombre: nombre,
        prod_precio: precio ? Number(precio) : null
      })
      .eq("prod_id", producto.prod_id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    onSaved();
    onClose();
  };

  const eliminar = async () => {
    if (!confirm("¿Eliminar producto?")) return;

    const { error } = await supabase
      .from("productos")
      .update({ prod_activo: false })
      .eq("prod_id", producto.prod_id);

    if (error) {
      alert(error.message);
      return;
    }

    onSaved();
    onClose();
  };

  return (
    <div>

      <div style={{ marginBottom: 12 }}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          style={input}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="Precio"
          type="number"
          style={input}
        />
      </div>

      <button onClick={guardar} style={btnPrimary} disabled={loading}>
        Guardar
      </button>

      <button onClick={eliminar} style={btnDanger}>
        Desactivar producto
      </button>

      <button onClick={onClose} style={btnSecondary}>
        Cancelar
      </button>
    </div>
  );
}

const input = {
  width: "100%",
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ddd"
};

const btnPrimary = {
  width: "100%",
  padding: 10,
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  marginBottom: 8
};

const btnDanger = {
  width: "100%",
  padding: 10,
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  marginBottom: 8
};

const btnSecondary = {
  width: "100%",
  padding: 10,
  background: "#e5e7eb",
  border: "none",
  borderRadius: 6
};