import { forwardRef } from "react";
import { Chip } from "@mui/material";

interface MDBadgeProps {
  variant?: "gradient" | "contained" | "outlined";
  color?: 
    | "primary"
    | "secondary" 
    | "info"
    | "success"
    | "warning"
    | "error"
    | "light"
    | "dark";
  size?: "xs" | "sm" | "md" | "lg";
  circular?: boolean;
  indicator?: boolean;
  border?: boolean;
  container?: boolean;
  children?: React.ReactNode;
  sx?: any;
  [key: string]: any;
}

const MDBadge = forwardRef<HTMLDivElement, MDBadgeProps>(
  ({ variant = "contained", color = "primary", size = "sm", children, sx, ...rest }, ref) => {
    
    const getBackgroundColor = () => {
      if (variant === "gradient") {
        switch (color) {
          case "primary":
            return "linear-gradient(195deg, #42424a, #191919)";
          case "secondary":
            return "linear-gradient(195deg, #747b8a, #495361)";
          case "info":
            return "linear-gradient(195deg, #66BB6A, #43A047)";
          case "success":
            return "linear-gradient(195deg, #66BB6A, #43A047)";
          case "warning":
            return "linear-gradient(195deg, #FFA726, #FB8C00)";
          case "error":
            return "linear-gradient(195deg, #EF5350, #E53935)";
          default:
            return "linear-gradient(195deg, #42424a, #191919)";
        }
      }
      return undefined;
    };

    const getSize = () => {
      switch (size) {
        case "xs": return { height: 16, fontSize: "0.625rem" };
        case "sm": return { height: 20, fontSize: "0.75rem" };
        case "md": return { height: 24, fontSize: "0.875rem" };
        case "lg": return { height: 28, fontSize: "1rem" };
        default: return { height: 20, fontSize: "0.75rem" };
      }
    };

    return (
      <Chip
        ref={ref}
        label={children}
        variant={variant === "outlined" ? "outlined" : "filled"}
        color={color === "secondary" ? "default" : color}
        size="small"
        sx={{
          background: getBackgroundColor(),
          color: variant === "gradient" ? "white" : undefined,
          ...getSize(),
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          ...sx,
        }}
        {...rest}
      />
    );
  }
);

MDBadge.displayName = "MDBadge";

export default MDBadge;