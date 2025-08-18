// Apple Bites Material Dashboard theme extensions for MUI
export const materialDashboardTheme = {
  gradients: {
    primary: {
      main: "#00718d",  // Apple Bites Teal
      state: "#005b6c"  // Apple Bites Teal Dark
    },
    secondary: {
      main: "#0A1F44",  // Apple Bites Navy
      state: "#07152E"  // Apple Bites Deeper Navy
    },
    info: {
      main: "#00718d",  // Apple Bites Teal
      state: "#005b6c"  // Apple Bites Teal Dark
    },
    success: {
      main: "#16A34A",  // Apple Bites Green
      state: "#15803D"  // Green Dark
    },
    warning: {
      main: "#F59E0B",  // Apple Bites Amber
      state: "#D97706"  // Amber Dark
    },
    error: {
      main: "#DC2626",  // Apple Bites Red
      state: "#B91C1C"  // Red Dark
    },
    light: {
      main: "#005b8c",  // Apple Bites Aqua Accent
      state: "#3B82F6"  // Apple Bites Glow Accent
    },
    dark: {
      main: "#0A1F44",  // Apple Bites Navy
      state: "#1E293B"  // Apple Bites Gray Darker
    }
  },
  
  boxShadows: {
    xs: "0 2px 9px -5px rgba(0, 0, 0, 0.15)",
    sm: "0 5px 13px -5px rgba(0, 0, 0, 0.20)",
    md: "0 2px 8px rgba(0,0,0,0.15)",
    lg: "0 23px 45px -11px rgba(0, 0, 0, 0.25)",
    xl: "0 35px 65px -12px rgba(0, 0, 0, 0.35)",
    xxl: "0 54px 100px -12px rgba(0, 0, 0, 0.35)",
    inset: "inset 0 1px 2px rgba(0, 0, 0, 0.075)",
    
    colored: {
      primary: "0 4px 20px 0 rgba(0, 113, 141, 0.14)",     // Apple Bites Teal
      secondary: "0 4px 20px 0 rgba(10, 31, 68, 0.14)",   // Apple Bites Navy
      info: "0 4px 20px 0 rgba(0, 113, 141, 0.14)",       // Apple Bites Teal
      success: "0 4px 20px 0 rgba(22, 163, 74, 0.14)",    // Apple Bites Green
      warning: "0 4px 20px 0 rgba(245, 158, 11, 0.14)",   // Apple Bites Amber
      error: "0 4px 20px 0 rgba(220, 38, 38, 0.14)",      // Apple Bites Red
      light: "0 4px 20px 0 rgba(0, 91, 140, 0.14)",       // Apple Bites Blue
      dark: "0 4px 20px 0 rgba(10, 31, 68, 0.14)"         // Apple Bites Navy
    }
  },

  borders: {
    borderRadius: {
      xs: "0.125rem",
      sm: "0.25rem", 
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      xxl: "1.25rem",
      section: "1.5rem"
    }
  },

  functions: {
    linearGradient: (color1: string, color2: string) => `linear-gradient(195deg, ${color1}, ${color2})`,
    pxToRem: (px: number) => `${px / 16}rem`,
    rgba: (color: string, opacity: number) => color.replace('rgb', 'rgba').replace(')', `, ${opacity})`),
    boxShadow: (offset: number[], radius: number[], color: string, opacity: number) => 
      `${offset[0]}px ${offset[1]}px ${radius[0]}px ${radius[1]}px ${color.replace('rgb', 'rgba').replace(')', `, ${opacity})`)}`
  }
};

// Augment MUI theme with Material Dashboard properties
declare module '@mui/material/styles' {
  interface Theme {
    gradients: typeof materialDashboardTheme.gradients;
    boxShadows: typeof materialDashboardTheme.boxShadows;
    borders: typeof materialDashboardTheme.borders;
    functions: typeof materialDashboardTheme.functions;
  }
  
  interface ThemeOptions {
    gradients?: typeof materialDashboardTheme.gradients;
    boxShadows?: typeof materialDashboardTheme.boxShadows;
    borders?: typeof materialDashboardTheme.borders;
    functions?: typeof materialDashboardTheme.functions;
  }
  
  interface Palette {
    white?: {
      main: string;
    };
    transparent?: {
      main: string;
    };
  }
  
  interface PaletteOptions {
    white?: {
      main: string;
    };
    transparent?: {
      main: string;
    };
  }
}