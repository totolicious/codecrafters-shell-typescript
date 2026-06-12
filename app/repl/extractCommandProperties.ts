import {
  type CommandNameAndArgs as CommandProperties,
  type FileRedirection,
} from "../types";
import { RedirectionOperator } from "./RedirectionOperator";

const SINGLE_QUOTE = "'";
const DOUBLE_QUOTE = '"';
const BACKSLASH = "\\";

export const isWhitespace = (char: string) => {
  return [" ", "\t"].includes(char);
};

const getRedirectionOperator = (
  input: string,
  cursor: number,
): RedirectionOperator | null => {
  const redirectionOperator = RedirectionOperator.getAll().find(
    (ro): boolean => {
      // symbol is too lengthy
      if (ro.token.length + cursor > input.length) {
        return false;
      }
      if (ro.token === input.slice(cursor, cursor + ro.token.length)) {
        return true;
      }
      return false;
    },
  );

  return redirectionOperator ?? null;
};

export const extractCommandProperties = (
  input: string,
  throwOnRedirectionMissingFilename: boolean = true,
): CommandProperties => {
  let commandName: string | undefined;
  const args: string[] = [];
  const fileRedirections: FileRedirection[] = [];
  let activeRedirectionOperator: RedirectionOperator | null = null;

  const addCurrentTokenIfNotEmpty = () => {
    if (!currentToken.length) {
      return;
    }

    // first is the command
    if (!commandName) {
      commandName = currentToken;
      currentToken = "";
      return;
    }

    // if redirecting, next argument is the file redirection target
    if (activeRedirectionOperator) {
      fileRedirections.push({
        filePath: currentToken,
        redirectionOperator: activeRedirectionOperator,
      });
      activeRedirectionOperator = null;
      currentToken = "";
      return;
    }

    // next are the arguments
    if (currentToken.length > 0) {
      args.push(currentToken);
      currentToken = "";
    }
  };

  let isInsideSingleQuotes = false;
  let isInsideDoubleQuotes = false;
  let isEscaping = false;

  let currentToken = "";
  let i: number = 0;
  while (i < input.length) {
    const char = input[i];

    if (!isEscaping) {
      if (char === SINGLE_QUOTE && !isInsideDoubleQuotes) {
        isInsideSingleQuotes = !isInsideSingleQuotes;
        i++; // single char advance
        continue;
      }

      if (!isInsideSingleQuotes) {
        if (char === BACKSLASH) {
          isEscaping = true;
          // single char advance
          i++;
          continue;
        }
        if (char === DOUBLE_QUOTE) {
          isInsideDoubleQuotes = !isInsideDoubleQuotes;
          // single char advance
          i++;
          continue;
        }
      }

      // identify current file redirection operator
      let currentRedirectionOperator: RedirectionOperator | null = null;
      let targetJump = 1;
      if (!isInsideSingleQuotes && !isInsideDoubleQuotes) {
        currentRedirectionOperator = getRedirectionOperator(input, i);
        if (currentRedirectionOperator && activeRedirectionOperator) {
          throw new Error(
            `Syntax error: active redirection operator ${activeRedirectionOperator.displayName} without target file followed by redirection operator ${currentRedirectionOperator.displayName}`,
          );
        }
        if (currentRedirectionOperator) {
          activeRedirectionOperator = currentRedirectionOperator;
          targetJump = currentRedirectionOperator.token.length;
        }
      }
      if (
        // defines the
        (isWhitespace(char) || currentRedirectionOperator) &&
        // must not be inside quotes
        !isInsideSingleQuotes &&
        !isInsideDoubleQuotes
      ) {
        addCurrentTokenIfNotEmpty();
        i += targetJump;
        continue;
      }
    }

    isEscaping = false;
    currentToken += char;
    i++;
  }

  addCurrentTokenIfNotEmpty();
  if (activeRedirectionOperator && throwOnRedirectionMissingFilename) {
    throw new Error(
      `Syntax error: redirection operator ${activeRedirectionOperator.displayName} is missing the file target"`,
    );
  }
  if (isInsideSingleQuotes) {
    throw new Error(`Syntax error: expecting closing single quotes`);
  }
  if (isInsideDoubleQuotes) {
    throw new Error(`Syntax error: expecting closing double quotes`);
  }
  return { commandName, args, fileRedirections };
};
