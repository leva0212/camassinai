import React,{useState} from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProductEditModal({producto,onSaved}:any){

  const [nombre,setNombre] = useState(producto?.nombre || "");
  const [precio,setPrecio] = useState(producto?.precio || "");

  const guardar = async()=>{

    const {error} = await supabase
      .from("productos")
      .update({
        nombre,
        precio
      })
      .eq("id",producto.id);

    if(!error){
      onSaved();
    }

  };

  return(

    <div>

      <h3>Editar Producto</h3>

      <input
        value={nombre}
        onChange={(e)=>setNombre(e.target.value)}
      />

      <input
        value={precio}
        onChange={(e)=>setPrecio(e.target.value)}
      />

      <button onClick={guardar}>
        Guardar
      </button>

    </div>

  );

}