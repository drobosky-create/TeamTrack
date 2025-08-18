/**
 * The boxShadow() function helps you to create a box shadow for an element
 */

import rgba from "./rgba";

function boxShadow(offset = [], radius = [], color, opacity, inset = "") {
  const [x, y] = offset;
  const [blur, spread] = radius;

  return `${inset} ${x} ${y} ${blur} ${spread} ${rgba(color, opacity)}`;
}

export default boxShadow;