"use client";

import "./plasmic-init";

export default function PlasmicProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}