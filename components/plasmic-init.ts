"use client";

import { registerComponent } from "@plasmicapp/host";

import { ProductTable } from "./ProductTable";
//import { ProductFormModal } from "./ProductFormModal";
import { ProductCategoriesManager } from "./ProductCategoriesManager";
import { ProductForm } from "./ProductForm";
import { CrudTable } from "./CrudTable";

// --- Registrar CrudTable ---
registerComponent(CrudTable, {
  name: "CrudTable", // Nombre que verás en Plasmic Studio
  importPath: "./CrudTable", // Ruta relativa del componente
  props: {
    tableName: {
      type: "string", // Será un input de texto en Plasmic
      defaultValue: "productos", // Valor por defecto
    },
  },
});


registerComponent(ProductCategoriesManager, {
  name: "ProductCategoriesManager",
  importPath: "./ProductCategoriesManager",
  props: {}
});

registerComponent(ProductTable, {
  name: "ProductTable",
  importPath: "./ProductTable",
  props: {
    refresh: {
      type: "number"
    }
  }
});

registerComponent(ProductForm, {
  name: "ProductForm",
  importPath: "./ProductForm",
  props: {
    onSaved: {
      type: "eventHandler",
      argTypes: []
    }
  }
});