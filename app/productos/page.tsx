"use client";

import { ProductForm } from "@/components/ProductForm";
import { ProductTable } from "@/components/ProductTable";
import { useState } from "react";

export default function ProductosPage() {

  const [refresh, setRefresh] = useState(false);

  return (
    <div>

      <ProductForm onSaved={() => setRefresh(!refresh)} />

      <ProductTable refresh={refresh} />

    </div>
  );
}