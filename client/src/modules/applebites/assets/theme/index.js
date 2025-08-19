/**
 * The base breakpoints for the Material Dashboard 2 
 */

import { createTheme } from "@mui/material/styles";

// Material Dashboard 2 Base Styles
import colors from "./base/colors";
import breakpoints from "./base/breakpoints";
import typography from "./base/typography";
import boxShadows from "./base/boxShadows";
import borders from "./base/borders";
// Material Dashboard 2 Helper Functions

// Material Dashboard 2 Helper Functions
import boxShadow from "./functions/boxShadow";
import hexToRgb from "./functions/hexToRgb";
import linearGradient from "./functions/linearGradient";
import pxToRem from "./functions/pxToRem";
import rgba from "./functions/rgba";

const theme = createTheme({
  breakpoints: { ...breakpoints },
  palette: { ...colors },
  typography: { ...typography },
  boxShadows: { ...boxShadows },
  borders: { ...borders },
  functions: {
    boxShadow,
    hexToRgb,
    linearGradient,
    pxToRem,
    rgba,
  },
});

export default theme;