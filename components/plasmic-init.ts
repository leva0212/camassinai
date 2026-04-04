"use client";

import { registerComponent } from "@plasmicapp/host";

import {ProductTable} from "./ProductTable";
import { ProductForm } from "./ProductForm";
import { ProductCategoriesManager } from "./ProductCategoriesManager";

registerComponent(ProductCategoriesManager,{
  name:"ProductCategoriesManager",
  importPath:"./components/ProductCategoriesManager",
  props:{}
});

registerComponent(ProductTable,{
  name:"ProductTable",
  importPath:"./components/ProductTable",
  props:{
    refresh:{
      type:"number"
    }
  }
});

registerComponent(ProductForm,{
  name:"ProductForm",
  importPath:"./components/ProductForm",
  props:{
    onSaved:{
      type:"eventHandler",
      argTypes:[]
    }
  }
});