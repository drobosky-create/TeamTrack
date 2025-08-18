/**
 * The base border-radius styles for the Material Dashboard 2
 */

function pxToRem(number, baseNumber = 16) {
  return `${number / baseNumber}rem`;
}

export default pxToRem;