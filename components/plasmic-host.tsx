"use client";

import { registerComponent } from "@plasmicapp/host";

import { ProductTable } from "./ProductTable";
import { ProductForm } from "./ProductForm";

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