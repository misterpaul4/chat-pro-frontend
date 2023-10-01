export const setLS = (key: string, value: any) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getLs = (key: string) => {
  const item = localStorage.getItem(key);
  if (typeof item === "string") {
    try {
      const result = JSON.parse(item);
      return result;
    } catch (error) {
      return "";
    }
  }
};

export const clearLs = (key: string) => localStorage.removeItem(key);
