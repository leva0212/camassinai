"use client";

import { registerComponent } from "@plasmicapp/host";

import { ProductTable } from "./ProductTable";
import { ProductForm } from "./ProductForm";
import { ProductCategoriesManager } from "./ProductCategoriesManager";

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