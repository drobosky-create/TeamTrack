import React, { forwardRef } from "react";
import { Typography, TypographyProps } from "@mui/material";
import { styled } from "@mui/material/styles";

interface MDTypographyProps extends TypographyProps {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "white" | "text" | "light";
  fontWeight?: "light" | "regular" | "medium" | "bold";
  textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
}

const MDTypographyRoot = styled(Typography)<{ mdProps: MDTypographyProps }>(({ theme, mdProps }) => {
  const { color, fontWeight, textTransform } = mdProps;

  const colors = {
    primary: "#00718d",
    secondary: "#7b1fa2",
    info: "#1A73E8",
    success: "#4CAF50",
    warning: "#fb8c00",
    error: "#F44335",
    dark: "#344767",
    white: "#ffffff",
    text: "#67748e",
    light: "#f0f2f5",
  };

  const fontWeights = {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
  };

  return {
    color: color && colors[color] ? colors[color] : "inherit",
    fontWeight: fontWeight ? fontWeights[fontWeight] : "inherit",
    textTransform: textTransform || "none",
    opacity: 1,
  };
});

const MDTypography = forwardRef<HTMLElement, MDTypographyProps>(
  ({ color = "dark", fontWeight = "regular", textTransform = "none", children, ...rest }, ref) => {
    // Remove mdProps from DOM to prevent React warnings
    const { color: _, fontWeight: __, textTransform: ___, ...domProps } = rest;
    
    return (
      <MDTypographyRoot
        {...domProps}
        ref={ref}
        mdProps={{ color, fontWeight, textTransform }}
      >
        {children}
      </MDTypographyRoot>
    );
  }
);

MDTypography.displayName = "MDTypography";

export default MDTypography;