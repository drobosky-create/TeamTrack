import React from "react";
import tokens from "./tokens.json";

export const CssVars: React.FC = () => (
  <style>{`
    :root {
      --ab-color-primary: ${tokens.color.primary};
      --ab-color-primaryLight: ${tokens.color.primaryLight};
      --ab-color-bg: ${tokens.color.backgroundLight};
      --ab-color-slate: ${tokens.color.slate};
      --ab-color-success: ${tokens.color.success};
      --ab-color-warning: ${tokens.color.warning};
      --ab-color-error: ${tokens.color.error};
      --ab-color-onBrand: ${tokens.color.textOnBrand};

      --ab-grad-brandBlue: ${tokens.gradient.brandBlue};
      --ab-grad-glasswhite: ${tokens.gradient.glasswhite};
      --ab-grad-growth: ${tokens.gradient.growth};

      --ab-radius-md: ${tokens.radius.md};
      --ab-radius-lg: ${tokens.radius.lg};
      --ab-blur-glass: ${tokens.blur.glass};
    }

    /* Dark mode hook: add data-theme="dark" to <html> or <body> */
    [data-theme="dark"] {
      --ab-color-bg: ${tokens.color.backgroundDark};
    }
  `}</style>
);
