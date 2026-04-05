"use client";

import { registerComponent } from "@plasmicapp/host";

import { ProductTable } from "./ProductTable";
//import { ProductFormModal } from "./ProductFormModal";
import { ProductCategoriesManager } from "./ProductCategoriesManager";
import { ProductForm } from "./ProductForm";
import { CrudTable } from "./CrudTable";

registerComponent(CrudTable, {
  name: "CrudTable",
  importPath: "./CrudTable",
  props: {
    table: "string",
    idField: "string",
    columns: "string" // Plasmic no entiende tipos complejos, puedes usar JSON.stringify / JSON.parse
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