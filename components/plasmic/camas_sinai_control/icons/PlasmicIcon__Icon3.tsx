/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon3IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon3Icon(props: Icon3IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      className={classNames("plasmic-default__svg", className, "logo")}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        stroke={"currentColor"}
        strokeLinejoin={"round"}
        strokeWidth={"2"}
        d={"M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5"}
      ></path>
    </svg>
  );
}

export default Icon3Icon;
/* prettier-ignore-end */
