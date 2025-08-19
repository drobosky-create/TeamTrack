import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { CssVars } from "./theme/cssVars";
import { lightTheme, darkTheme } from "./theme/muiTheme";
import App from "./App";

const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
const theme = prefersDark ? darkTheme : lightTheme;

// Optional: sync HTML attribute for CSS variables
document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CssVars />
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
