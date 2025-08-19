import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { CssVars } from "../../src/theme/cssVars";

createRoot(document.getElementById("root")!).render(
  <>
    <CssVars />
    <App />
  </>
);
