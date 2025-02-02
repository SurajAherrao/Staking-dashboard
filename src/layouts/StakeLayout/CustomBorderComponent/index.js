import React, { useState } from "react";

import styles from "./CustomBorder.module.css";

export default function CustomBorderComponent({
  children,
  bgColor,
  flagBorder = false,
  isHover = false,
  onHoverBgColor = ""
}) {
  // Define state for hover interaction
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className={`${flagBorder ? styles.flagBanner : styles.banner} `}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        backgroundColor: hovering && isHover ? onHoverBgColor : bgColor
      }}
    >
      <div
        className={flagBorder ? styles.flagBannerTop : styles.bannerTop}
      ></div>
      <div
        className={flagBorder ? styles.flagBannerBottom : styles.bannerBottom}
      ></div>
      {children}
    </div>
  );
}