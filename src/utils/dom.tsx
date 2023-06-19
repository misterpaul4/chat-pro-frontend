export const checkIfElementVisible = (
  el: HTMLElement,
  partiallyVisible = false
) => {
  // thanks to ==> https://www.30secondsofcode.org/js/s/element-is-visible-in-viewport/
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

