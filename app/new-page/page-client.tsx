"use client";

import * as React from "react";
import {
  PlasmicNewPage,
  DefaultNewPageProps
} from "../../components/plasmic/camas_sinai_control/PlasmicNewPage"; // plasmic-import: wHKtoZrzCYRH/render

export function ClientNewPage(props: DefaultNewPageProps) {
  return <PlasmicNewPage {...props} />;
}
