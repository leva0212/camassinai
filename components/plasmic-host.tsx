"use client";

import { registerComponent } from "@plasmicapp/host";

import { ProductTable } from "./ProductTable";
import { ProductForm } from "./ProductForm";
import { CrudTable } from "./CrudTable";

// --- Registrar CrudTable para renderizado en la app ---
registerComponent(CrudTable, {
  name: "CrudTable",
  importPath: "./CrudTable",
  props: {
    tableName: {
      type: "string",
      defaultValue: "productos",
    },
  },
});
registerComponent(ProductTable, {
  name: "ProductTable",
  importPath: "./ProductTable",
  props: {}
});

registerComponent(ProductForm, {
  name: "ProductForm",
  importPath: "./ProductForm",
  props: {}
});