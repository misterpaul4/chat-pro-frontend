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

export const maskEmail = (email: string) => {
  const emailParts = email.split("@");
  const emailName = emailParts[0];
  const emailDomain = emailParts[1];
  const maskedEmailName =
    emailName[0] +
    "*".repeat(emailName.length - 2) +
    emailName[emailName.length - 1];
  const maskedEmailDomain = "***" + emailDomain.slice(emailDomain.indexOf("."));
  return maskedEmailName + "@" + maskedEmailDomain;
};

