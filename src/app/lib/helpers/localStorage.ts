export const setLS = (key: string, value: any) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getLs = (key: string) => {
  const item = localStorage.getItem(key);
  if (typeof item === "string") {
    return JSON.parse(item);
  }
};

