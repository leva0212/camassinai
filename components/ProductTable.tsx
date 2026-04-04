"use client";

import { useEffect,useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProductTable({refresh}:any){

  const [productos,setProductos] = useState<any[]>([]);

  const cargar = async()=>{

    const {data,error} = await supabase
      .from("productos")
      .select(`
        prod_id,
        prod_nombre,
        prod_precio,
        prod_activo,
        productos_categorias(
          prod_cat_nombre
        )
      `)
      .order("prod_fechaCreacion",{ascending:false});

    if(!error){
      setProductos(data || []);
    }

  };

  useEffect(()=>{
    cargar();
  },[refresh]);

  const eliminar = async(id:number)=>{

    if(!confirm("Eliminar producto?")) return;

    await supabase
      .from("productos")
      .delete()
      .eq("prod_id",id);

    cargar();

  };

  return(

    <div style={{
      background:"#fff",
      borderRadius:10,
      boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
      overflow:"hidden"
    }}>

      <table style={{
        width:"100%",
        borderCollapse:"collapse"
      }}>

        <thead style={{
          background:"#f4f6f8"
        }}>

          <tr>

            <th style={th}>Producto</th>
            <th style={th}>Categoría</th>
            <th style={th}>Precio</th>
            <th style={th}>Activo</th>
            <th style={th}></th>

          </tr>

        </thead>

        <tbody>

          {productos.map((p:any)=>(

            <tr key={p.prod_id} style={{borderTop:"1px solid #eee"}}>

              <td style={td}>{p.prod_nombre}</td>

              <td style={td}>
                {p.productos_categorias?.prod_cat_nombre || "-"}
              </td>

              <td style={td}>
                ₡ {Number(p.prod_precio || 0).toLocaleString()}
              </td>

              <td style={td}>
                {p.prod_activo ? "Sí" : "No"}
              </td>

              <td style={td}>

                <button
                  onClick={()=>eliminar(p.prod_id)}
                  style={{
                    background:"#ef4444",
                    color:"#fff",
                    border:"none",
                    padding:"6px 10px",
                    borderRadius:6,
                    cursor:"pointer"
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
  textAlign:"left" as const,
  padding:"12px",
  fontWeight:600,
  fontSize:14
};

const td = {
  padding:"12px",
  fontSize:14
};