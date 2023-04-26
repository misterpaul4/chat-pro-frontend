export const capitalize = (word: string) =>
  word ? word[0].toUpperCase() + word.slice(1) : word;

export const toTitleCase = (str: string | undefined) => {
  if (str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => capitalize(word))
      .join(" ");
  }

  return str;
};

