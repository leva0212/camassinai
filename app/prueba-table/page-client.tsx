"use client";

import * as React from "react";
import {
  PlasmicPruebaTable,
  DefaultPruebaTableProps
} from "../../components/plasmic/camas_sinai_control/PlasmicPruebaTable"; // plasmic-import: j-WUM6FzFAEB/render

export function ClientPruebaTable(props: DefaultPruebaTableProps) {
  return <PlasmicPruebaTable {...props} />;
}
