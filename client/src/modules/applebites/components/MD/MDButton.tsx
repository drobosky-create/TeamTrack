import React, { forwardRef } from "react";
import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

interface MDButtonProps extends Omit<ButtonProps, 'color'> {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "light";
  variant?: "text" | "contained" | "outlined" | "gradient";
  size?: "small" | "medium" | "large";
}

const MDButtonRoot = styled(Button)<{ mdvariant?: string; mdcolor?: string }>(({ theme, mdvariant, mdcolor }) => {
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

  const shadows = {
    primary: "0 4px 20px 0 rgba(0, 191, 166, 0.14)",
    secondary: "0 4px 20px 0 rgba(123, 31, 162, 0.14)",
    info: "0 4px 20px 0 rgba(26, 115, 232, 0.14)",
    success: "0 4px 20px 0 rgba(76, 175, 80, 0.14)",
    warning: "0 4px 20px 0 rgba(251, 140, 0, 0.14)",
    error: "0 4px 20px 0 rgba(244, 67, 53, 0.14)",
    dark: "0 4px 20px 0 rgba(66, 66, 74, 0.14)",
    light: "0 4px 20px 0 rgba(240, 242, 245, 0.14)",
  };

  if (mdvariant === "gradient") {
    const gradientColor = (mdcolor as keyof typeof gradients) || "info";
    return {
      background: gradients[gradientColor],
      color: "#ffffff",
      border: "none",
      boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.16)",
      borderRadius: "0.75rem",
      textTransform: "none",
      fontWeight: 600,
      padding: "12px 24px",
      "&:hover": {
        background: gradients[gradientColor],
        boxShadow: shadows[gradientColor],
        transform: "translateY(-1px)",
      },
      "&:focus": {
        background: gradients[gradientColor],
        boxShadow: shadows[gradientColor],
      },
      "&:active": {
        background: gradients[gradientColor],
        transform: "translateY(0)",
      },
    };
  }

  return {
    borderRadius: "0.75rem",
    textTransform: "none",
    fontWeight: 600,
  };
});

const MDButton = forwardRef<HTMLButtonElement, MDButtonProps>(
  ({ color = "info", variant = "contained", children, ...rest }, ref) => {
    // Remove custom props from DOM to prevent React warnings
    const { color: _, variant: __, ...domProps } = rest;
    
    return (
      <MDButtonRoot
        {...domProps}
        ref={ref}
        variant={variant === "gradient" ? "contained" : variant}
        mdvariant={variant}
        mdcolor={color}
      >
        {children}
      </MDButtonRoot>
    );
  }
);

MDButton.displayName = "MDButton";

export default MDButton;