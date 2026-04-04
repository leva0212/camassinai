import ProductTable from "@/components/ProductTable";
import {ProductForm} from "@/components/ProductForm";

export default function ProductosPage(){

  return(

    <div style={{padding:40}}>

      <h1>Productos</h1>

      <ProductForm />

      <br/>

      <ProductTable />

    </div>

  )

}