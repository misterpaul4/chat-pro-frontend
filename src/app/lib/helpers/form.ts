import { Rule } from "antd/es/form";

interface IPasswordRule {
  name?: string;
  min?: number;
  max?: number;
  uppercased?: boolean;
  lowercased?: boolean;
  number?: boolean;
  numbered?: boolean;
  required?: boolean;
  verifyLength?: boolean;
}

export const passwordRule: (param?: IPasswordRule) => Rule[] = ({
  name = "password",
  max = 20,
  min = 8,
  uppercased = true,
  lowercased = true,
  numbered = true,
  required = true,
  verifyLength = true,
} = {}) => {
  const rules: Rule[] = [];

  verifyLength &&
    rules.push({
      min: min,
      max: max,
      message: `${name} must be between ${min} and ${max} characters`,
    });

  required &&
    rules.push({
      required: true,
      message: `${name} is required`,
    });

  uppercased &&
    rules.push({
      pattern: /(?=.*[A-Z]).*$/,
      message: `${name} must contain at least 1 UPPERCASE character`,
    });

  lowercased &&
    rules.push({
      pattern: /(?=.*[a-z]).*$/,
      message: `${name} must contain at least 1 lowercase`,
    });

  numbered &&
    rules.push({
      pattern: /(?=.*\d).*$/,
      message: `${name} must contain at least 1 Number`,
    });

  return rules;
};

export const requiredRule = (name = "Field") =>
  [
    {
      required: true,
      message: `${name} is required`,
    },
  ] satisfies Rule[];

