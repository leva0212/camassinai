"use client";

import * as React from "react";
import {
  PlasmicHomepage,
  DefaultHomepageProps
} from "../components/plasmic/camas_sinai_control/PlasmicHomepage"; // plasmic-import: ru35t2QF72cm/render

export function ClientHomepage(props: DefaultHomepageProps) {
  return <PlasmicHomepage {...props} />;
}
