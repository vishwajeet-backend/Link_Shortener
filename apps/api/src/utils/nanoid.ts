import { customAlphabet } from "nanoid";

const SHORT_CODE_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const SHORT_CODE_LENGTH = 8;

const generator = customAlphabet(SHORT_CODE_ALPHABET, SHORT_CODE_LENGTH);

export const generateShortCode = (): string => generator();
