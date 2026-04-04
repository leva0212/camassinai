"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  onSaved?: () => void;
};

export function ProductForm({ onSaved }: Props) {

  const [nombre,setNombre] = useState("");
  const [precio,setPrecio] = useState("");
  const [categoria,setCategoria] = useState("");
  const [categorias,setCategorias] = useState<any[]>([]);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    cargarCategorias();
  },[]);

  const cargarCategorias = async()=>{

    const {data,error} = await supabase
      .from("productos_categorias")
      .select("*")
      .order("prod_cat_nombre");

    if(!error){
      setCategorias(data || []);
    }

  };

  const guardar = async()=>{

    if(!nombre){
      alert("Nombre requerido");
      return;
    }

    setLoading(true);

    const {data,error} = await supabase
      .from("productos")
      .insert({
        prod_nombre:nombre,
        prod_precio:precio ? Number(precio) : null,
        prod_cat_id:categoria || null
      })
      .select()
      .single();

    if(error){

      alert(error.message);

    }else if(data){

      await supabase
        .from("inventario")
        .insert({
          inv_prodId:data.prod_id,
          inv_disponible:0,
          inv_reservado:0
        });

      setNombre("");
      setPrecio("");
      setCategoria("");

      onSaved?.();
    }

    setLoading(false);

  };

  return(

    <div style={{
      background:"#ffffff",
      padding:20,
      borderRadius:10,
      boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
      marginBottom:20
    }}>

      <h3 style={{marginBottom:15}}>Crear producto</h3>

      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>

        <input
          placeholder="Nombre del producto"
          value={nombre}
          onChange={e=>setNombre(e.target.value)}
          style={{
            padding:10,
            borderRadius:6,
            border:"1px solid #ddd",
            flex:1
          }}
        />

        <input
          placeholder="Precio"
          type="number"
          value={precio}
          onChange={e=>setPrecio(e.target.value)}
          style={{
            padding:10,
            borderRadius:6,
            border:"1px solid #ddd",
            width:120
          }}
        />

        <div style={{
  display:"flex",
  gap:6,
  alignItems:"center"
}}>

  <select
    value={categoria}
    onChange={e=>setCategoria(e.target.value)}
    style={{
      padding:10,
      borderRadius:6,
      border:"1px solid #ddd"
    }}
  >

    <option value="">Categoría</option>

    {categorias.map((c:any)=>(
      <option key={c.prod_cat_id} value={c.prod_cat_id}>
        {c.prod_cat_nombre}
      </option>
    ))}

  </select>

  <button
    type="button"
    onClick={cargarCategorias}
    title="Recargar categorías"
    style={{
      padding:"8px 10px",
      borderRadius:6,
      border:"1px solid #ddd",
      background:"#f9f9f9",
      cursor:"pointer",
      fontSize:16
    }}
  >
    🔄
  </button>

</div>

        <button
          onClick={guardar}
          disabled={loading}
          style={{
            background:"#4f46e5",
            color:"#fff",
            border:"none",
            padding:"10px 16px",
            borderRadius:6,
            cursor:"pointer"
          }}
        >
          {loading ? "Guardando..." : "Crear"}
        </button>

      </div>

    </div>

  );

}