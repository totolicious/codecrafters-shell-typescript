import type { CommandNameAndArgs } from "../types";

const isWhitespace = (char: string) => {
  return [" ", "\t"].includes(char);
};

const SINGLE_QUOTE = "'";
const DOUBLE_QUOTE = '"';
const BACKSLASH = "\\";

const extractTokens = (input: string) => {
  const tokens: string[] = [];

  const addCurrentTokenIfNotEmpty = () => {
    if (currentToken.length > 0) {
      tokens.push(currentToken);
      currentToken = "";
    }
  };

  let isInsideSingleQuotes = false;
  let isInsideDoubleQuotes = false;
  let isEscaping = false;

  let currentToken = "";
  for (const char of input) {
    if (char === BACKSLASH && !isEscaping) {
      isEscaping = true;
      continue;
    }

    if (!isEscaping) {
      if (char === SINGLE_QUOTE && !isInsideDoubleQuotes) {
        isInsideSingleQuotes = !isInsideSingleQuotes;
        continue;
      }

      if (char === DOUBLE_QUOTE && !isInsideSingleQuotes) {
        isInsideDoubleQuotes = !isInsideDoubleQuotes;
        continue;
      }

      if (
        isWhitespace(char) &&
        !isInsideSingleQuotes &&
        !isInsideDoubleQuotes
      ) {
        addCurrentTokenIfNotEmpty();
        continue;
      }
    }

    isEscaping = false;
    currentToken += char;
  }

  addCurrentTokenIfNotEmpty();
  return tokens;
};

export const extractCommandAndArgs = (input: string): CommandNameAndArgs => {
  const tokens = extractTokens(input);

  if (tokens.length === 0) {
    return { commandName: undefined, args: [] };
  }

  return { commandName: tokens[0], args: tokens.slice(1) };
};
