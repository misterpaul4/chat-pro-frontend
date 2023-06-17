const baseColor = "#4287f5";

function getHexColors(): { [key: string]: string } {
  const hexColors: { [key: string]: string } = {};
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < alphabet.length; i++) {
    const letter = alphabet[i];
    let [red, green, blue] = baseColor
      .substring(1)
      .match(/.{2}/g)!
      .map((component) => parseInt(component, 16));

    // Calculate new color by modifying the base color components
    red = (red + i) % 256;
    green = (green + i) % 256;
    blue = (blue + i) % 256;

    // Convert color components back to HEX format
    const hexColor = `#${red.toString(16).padStart(2, "0")}${green
      .toString(16)
      .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;

    // Add the letter and its corresponding color to the object
    hexColors[letter] = hexColor;
  }

  return hexColors;
}

export const contactColors = getHexColors();
export const getContactColor = (value: string) =>
  contactColors[value] || baseColor;

