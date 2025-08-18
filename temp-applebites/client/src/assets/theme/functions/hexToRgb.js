/**
 * The hexToRgb() function helps you to change the hex color code to rgb
 */

function hexToRgb(color) {
  return color
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => `#${r}${r}${g}${g}${b}${b}`
    )
    .substring(1)
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16))
    .join(", ");
}

export default hexToRgb;