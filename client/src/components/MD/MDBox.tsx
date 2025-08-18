import React, { forwardRef } from "react";
import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

interface MDBoxProps extends BoxProps {
  variant?: "contained" | "gradient";
  bgColor?: string;
  borderRadius?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "section";
  shadow?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "inset" | "none";
  coloredShadow?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark" | "none";
}

const MDBoxRoot = styled(Box)<{ mdProps: MDBoxProps }>(({ theme, mdProps }) => {
  const { variant, bgColor, borderRadius, shadow, coloredShadow } = mdProps;

  // Material Dashboard gradients
  const gradients = {
    primary: "linear-gradient(195deg, #00718d, #0A1F44)",
    secondary: "linear-gradient(195deg, #7b1fa2, #6a1b9a)",
    info: "linear-gradient(195deg, #1A73E8, #1662C4)",
    success: "linear-gradient(195deg, #4CAF50, #43A047)",
    warning: "linear-gradient(195deg, #fb8c00, #f57c00)",
    error: "linear-gradient(195deg, #F44335, #D32F2F)",
    dark: "linear-gradient(195deg, #42424a, #191919)",
    light: "linear-gradient(195deg, #f0f2f5, #e9ecef)",
  };

  const borderRadiusMap = {
    xs: "0.125rem",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    xxl: "1.25rem",
    section: "1.5rem",
  };

  const boxShadowMap = {
    xs: "0 2px 9px -5px rgba(0, 0, 0, 0.15)",
    sm: "0 5px 13px -5px rgba(0, 0, 0, 0.20)",
    md: "0 2px 8px rgba(0,0,0,0.15)",
    lg: "0 23px 45px -11px rgba(0, 0, 0, 0.25)",
    xl: "0 35px 65px -12px rgba(0, 0, 0, 0.35)",
    xxl: "0 54px 100px -12px rgba(0, 0, 0, 0.35)",
    inset: "inset 0 1px 2px rgba(0, 0, 0, 0.075)",
    none: "none",
  };

  const coloredShadowMap = {
    primary: "0 4px 20px 0 rgba(0, 191, 166, 0.14)",
    secondary: "0 4px 20px 0 rgba(123, 31, 162, 0.14)",
    info: "0 4px 20px 0 rgba(26, 115, 232, 0.14)",
    success: "0 4px 20px 0 rgba(76, 175, 80, 0.14)",
    warning: "0 4px 20px 0 rgba(251, 140, 0, 0.14)",
    error: "0 4px 20px 0 rgba(244, 67, 53, 0.14)",
    light: "0 4px 20px 0 rgba(240, 242, 245, 0.14)",
    dark: "0 4px 20px 0 rgba(66, 66, 74, 0.14)",
    none: "none",
  };

  let background = "rgba(0, 0, 0, 0)"; // Use transparent rgba instead
  if (variant === "gradient" && bgColor && gradients[bgColor as keyof typeof gradients]) {
    background = gradients[bgColor as keyof typeof gradients];
  } else if (bgColor === "white") {
    background = "#ffffff";
  } else if (bgColor === "transparent") {
    background = "rgba(0, 0, 0, 0)";
  } else if (bgColor) {
    background = bgColor;
  }

  const borderRadiusValue = borderRadius ? borderRadiusMap[borderRadius] : "0";
  const boxShadowValue = shadow ? boxShadowMap[shadow] : "none";
  const coloredShadowValue = coloredShadow && coloredShadow !== "none" ? coloredShadowMap[coloredShadow] : null;

  return {
    background,
    borderRadius: borderRadiusValue,
    boxShadow: coloredShadowValue || boxShadowValue,
  };
});

const MDBox = forwardRef<HTMLDivElement, MDBoxProps>(
  ({ variant = "contained", bgColor = "transparent", borderRadius = "none", shadow = "none", coloredShadow = "none", children, ...rest }, ref) => {
    // Remove mdProps from DOM to prevent React warnings
    const { variant: _, bgColor: __, borderRadius: ___, shadow: ____, coloredShadow: _____, ...domProps } = rest;
    
    return (
      <MDBoxRoot
        {...domProps}
        ref={ref}
        mdProps={{ variant, bgColor, borderRadius, shadow, coloredShadow }}
      >
        {children}
      </MDBoxRoot>
    );
  }
);

MDBox.displayName = "MDBox";

export default MDBox;