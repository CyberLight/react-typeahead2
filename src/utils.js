/* global window: false */

function getDirection(element) {
  let result = null;
  if (element) {
    if (window.getComputedStyle) {
      result = window.getComputedStyle(element, null).direction;
    } else if (element.currentStyle) {
      result = element.currentStyle.direction;
    }
  }

  return result;
}

export default getDirection;
