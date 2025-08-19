import { createTheme, ThemeOptions } from "@mui/material/styles";
import tokens from "./tokens.json";

const common = {
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: `'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: "var(--ab-radius-md)" },
        containedPrimary: {
          color: tokens.color.textOnBrand
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: "var(--ab-radius-lg)" }
      }
    }
  }
} satisfies ThemeOptions;

export const lightTheme = createTheme({
  ...common,
  palette: {
    mode: "light",
    primary: {
      main: tokens.color.primary,
      light: tokens.color.primaryLight,
      contrastText: tokens.color.textOnBrand
    },
    background: {
      default: tokens.color.backgroundLight,
      paper: "#F7FAFC"
    },
    text: {
      primary: "#0B1220",
      secondary: tokens.color.slate
    },
    success: { main: tokens.color.success },
    warning: { main: tokens.color.warning },
    error:   { main: tokens.color.error }
  }
});

export const darkTheme = createTheme({
  ...common,
  palette: {
    mode: "dark",
    primary: {
      main: tokens.color.primaryLight,
      light: "#6FB8FF",
      contrastText: tokens.color.textOnBrand
    },
    background: {
      default: tokens.color.backgroundDark,
      paper: "#0E1626"
    },
    text: {
      primary: "#E6EEF8",
      secondary: "#B5C1D1"
    },
    success: { main: tokens.color.success },
    warning: { main: tokens.color.warning },
    error:   { main: tokens.color.error }
  }
});
