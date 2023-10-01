export const checkIfElementVisible = (
  el: HTMLElement,
  partiallyVisible = false
) => {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

export const inputFocus = () => {
  const inputEle = document.getElementById("input-box");
  inputEle?.focus();
};

export const getMessageContent = () => {
  const inputEle = document.getElementById("input-box");
  return inputEle?.textContent;
};

