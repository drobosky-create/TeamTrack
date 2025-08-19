import { createTheme, alpha } from "@mui/material/styles";
import tokens from "./tokens.json";
import { gradients } from "./gradients";

// Augment the theme to add tokens and gradients
declare module "@mui/material/styles" {
  interface Theme {
    tokens: typeof tokens;
    gradients: typeof gradients;
  }
  interface ThemeOptions {
    tokens?: typeof tokens;
    gradients?: typeof gradients;
  }
}

// Generate gradient strings from tokens for components
const gradientStrings = {
  primary: `linear-gradient(45deg, ${tokens.color.primaryGradientStart} 30%, ${tokens.color.primaryGradientEnd} 90%)`,
  secondary: `linear-gradient(45deg, ${tokens.color.secondary} 30%, ${tokens.color.secondaryDark} 90%)`,
  info: `linear-gradient(45deg, ${tokens.color.info} 30%, ${alpha(tokens.color.info, 0.8)} 90%)`,
  success: `linear-gradient(45deg, ${tokens.color.success} 30%, ${alpha(tokens.color.success, 0.8)} 90%)`,
  warning: `linear-gradient(45deg, ${tokens.color.warning} 30%, ${alpha(tokens.color.warning, 0.8)} 90%)`,
  error: `linear-gradient(45deg, ${tokens.color.error} 30%, ${alpha(tokens.color.error, 0.8)} 90%)`,
  dark: `linear-gradient(135deg, ${tokens.color.backgroundDark} 0%, ${tokens.color.backgroundDarkPaper} 100%)`,
  light: `linear-gradient(135deg, ${tokens.color.backgroundLight} 0%, ${tokens.color.backgroundPaper} 100%)`
};

// Common theme configuration
const commonTheme = {
  shape: { 
    borderRadius: tokens.radius.md 
  },
  typography: {
    fontFamily: tokens.font.family.primary,
    fontSize: parseFloat(tokens.font.size.md) * 16, // Convert rem to px
    h1: {
      fontSize: tokens.font.size["5xl"],
      fontWeight: tokens.font.weight.bold,
      lineHeight: tokens.font.lineHeight.tight
    },
    h2: {
      fontSize: tokens.font.size["4xl"],
      fontWeight: tokens.font.weight.bold,
      lineHeight: tokens.font.lineHeight.tight
    },
    h3: {
      fontSize: tokens.font.size["3xl"],
      fontWeight: tokens.font.weight.semibold,
      lineHeight: tokens.font.lineHeight.normal
    },
    h4: {
      fontSize: tokens.font.size["2xl"],
      fontWeight: tokens.font.weight.semibold,
      lineHeight: tokens.font.lineHeight.normal
    },
    h5: {
      fontSize: tokens.font.size.xl,
      fontWeight: tokens.font.weight.medium,
      lineHeight: tokens.font.lineHeight.normal
    },
    h6: {
      fontSize: tokens.font.size.lg,
      fontWeight: tokens.font.weight.medium,
      lineHeight: tokens.font.lineHeight.normal
    },
    body1: {
      fontSize: tokens.font.size.md,
      lineHeight: tokens.font.lineHeight.normal
    },
    body2: {
      fontSize: tokens.font.size.sm,
      lineHeight: tokens.font.lineHeight.normal
    },
    caption: {
      fontSize: tokens.font.size.xs,
      lineHeight: tokens.font.lineHeight.normal
    }
  },
  spacing: (factor: number) => `${factor * tokens.spacing.sm}px`,
  shadows: [
    "none",
    tokens.shadow.xs,
    tokens.shadow.sm,
    tokens.shadow.sm,
    tokens.shadow.md,
    tokens.shadow.md,
    tokens.shadow.md,
    tokens.shadow.lg,
    tokens.shadow.lg,
    tokens.shadow.lg,
    tokens.shadow.lg,
    tokens.shadow.lg,
    tokens.shadow.xl,
    tokens.shadow.xl,
    tokens.shadow.xl,
    tokens.shadow.xl,
    tokens.shadow.xl,
    tokens.shadow.xl,
    tokens.shadow.xl,
    tokens.shadow.xl,
    tokens.shadow["2xl"],
    tokens.shadow["2xl"],
    tokens.shadow["2xl"],
    tokens.shadow["2xl"],
    tokens.shadow["2xl"]
  ] as any,
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    },
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
    }
  },
  zIndex: tokens.zIndex,
  tokens,
  gradients
};

// Light theme
export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: "light",
    primary: {
      main: tokens.color.primary,
      light: tokens.color.primaryLight,
      dark: tokens.color.primaryDark,
      contrastText: tokens.color.textOnBrand
    },
    secondary: {
      main: tokens.color.secondary,
      light: tokens.color.secondaryLight,
      dark: tokens.color.secondaryDark,
      contrastText: tokens.color.textOnBrand
    },
    background: {
      default: tokens.color.backgroundLight,
      paper: tokens.color.backgroundPaper
    },
    text: {
      primary: tokens.color.textPrimary,
      secondary: tokens.color.textSecondary
    },
    success: { main: tokens.color.success },
    warning: { main: tokens.color.warning },
    error: { main: tokens.color.error },
    info: { main: tokens.color.info },
    grey: tokens.color.gray
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm,
          textTransform: "none",
          fontWeight: tokens.font.weight.medium,
          transition: tokens.transition.normal,
          boxShadow: tokens.shadow.sm,
          "&:hover": {
            boxShadow: tokens.shadow.md
          }
        },
        containedPrimary: {
          background: gradientStrings.primary,
          "&:hover": {
            background: gradientStrings.primary,
            filter: "brightness(1.1)"
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.md,
          boxShadow: tokens.shadow.md,
          transition: tokens.transition.normal,
          "&:hover": {
            boxShadow: tokens.shadow.lg
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.md
        },
        elevation1: {
          boxShadow: tokens.shadow.sm
        },
        elevation2: {
          boxShadow: tokens.shadow.md
        },
        elevation3: {
          boxShadow: tokens.shadow.lg
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: tokens.radius.sm,
            transition: tokens.transition.fast,
            "&:hover": {
              boxShadow: tokens.shadow.sm
            },
            "&.Mui-focused": {
              boxShadow: tokens.shadow.md
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.full,
          fontWeight: tokens.font.weight.medium
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.shadow["2xl"]
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: tokens.shadow.xl
        }
      }
    }
  }
});

// Dark theme
export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: "dark",
    primary: {
      main: tokens.color.primaryLight,
      light: "#8fa1ff",
      dark: tokens.color.primary,
      contrastText: tokens.color.textOnBrand
    },
    secondary: {
      main: tokens.color.secondaryLight,
      light: "#c5d0e0",
      dark: tokens.color.secondary,
      contrastText: tokens.color.textOnBrand
    },
    background: {
      default: tokens.color.backgroundDark,
      paper: tokens.color.backgroundDarkPaper
    },
    text: {
      primary: "#E6EEF8",
      secondary: "#B5C1D1"
    },
    success: { main: tokens.color.success },
    warning: { main: tokens.color.warning },
    error: { main: tokens.color.error },
    info: { main: tokens.color.info },
    grey: {
      50: tokens.color.gray["900"],
      100: tokens.color.gray["800"],
      200: tokens.color.gray["700"],
      300: tokens.color.gray["600"],
      400: tokens.color.gray["500"],
      500: tokens.color.gray["400"],
      600: tokens.color.gray["300"],
      700: tokens.color.gray["200"],
      800: tokens.color.gray["100"],
      900: tokens.color.gray["50"]
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm,
          textTransform: "none",
          fontWeight: tokens.font.weight.medium,
          transition: tokens.transition.normal,
          boxShadow: "none",
          "&:hover": {
            boxShadow: tokens.shadow.sm
          }
        },
        containedPrimary: {
          background: gradientStrings.primary,
          "&:hover": {
            background: gradientStrings.primary,
            filter: "brightness(1.2)"
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.md,
          boxShadow: "none",
          border: `1px solid ${alpha("#ffffff", 0.1)}`,
          transition: tokens.transition.normal,
          "&:hover": {
            boxShadow: tokens.shadow.md,
            borderColor: alpha("#ffffff", 0.2)
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.md,
          backgroundImage: "none"
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: tokens.radius.sm,
            transition: tokens.transition.fast,
            "& fieldset": {
              borderColor: alpha("#ffffff", 0.2)
            },
            "&:hover fieldset": {
              borderColor: alpha("#ffffff", 0.3)
            },
            "&.Mui-focused fieldset": {
              borderColor: tokens.color.primaryLight
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.full,
          fontWeight: tokens.font.weight.medium,
          borderColor: alpha("#ffffff", 0.2)
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.shadow["2xl"],
          backgroundImage: "none"
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: "none",
          borderRight: `1px solid ${alpha("#ffffff", 0.1)}`
        }
      }
    }
  }
});