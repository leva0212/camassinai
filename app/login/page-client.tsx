"use client";

import * as React from "react";
import {
  PlasmicLogin,
  DefaultLoginProps
} from "../../components/plasmic/camas_sinai_control/PlasmicLogin"; // plasmic-import: sb55HXsakhYt/render

export function ClientLogin(props: DefaultLoginProps) {
  return <PlasmicLogin {...props} />;
}
