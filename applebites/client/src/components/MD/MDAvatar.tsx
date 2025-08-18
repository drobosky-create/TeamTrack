import { forwardRef } from "react";
import { Avatar } from "@mui/material";

interface MDAvatarProps {
  bgColor?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  shadow?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "inset";
  children?: React.ReactNode;
  sx?: any;
  [key: string]: any;
}

const MDAvatar = forwardRef<HTMLDivElement, MDAvatarProps>(
  ({ bgColor, size, shadow, children, sx, ...rest }, ref) => {
    return (
      <Avatar
        ref={ref}
        sx={{
          backgroundColor: bgColor,
          width: size === "sm" ? 32 : size === "lg" ? 56 : 40,
          height: size === "sm" ? 32 : size === "lg" ? 56 : 40,
          boxShadow: shadow === "sm" ? 1 : shadow === "md" ? 2 : shadow === "lg" ? 3 : 0,
          ...sx,
        }}
        {...rest}
      >
        {children}
      </Avatar>
    );
  }
);

MDAvatar.displayName = "MDAvatar";

export default MDAvatar;