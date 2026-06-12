import type { AsyncCompleter, Interface } from "node:readline";

import { ringBell } from "./ringBell";
import { getBuiltinCommandCompletion } from "../completer/getBuiltinCommandCompletion";
import { getPathCommandCompletion } from "../completer/getPathCommandCompletion";
import {
  extractCommandProperties,
  isWhitespace,
} from "./extractCommandProperties";
import { getFileCompletionsForPrefix } from "../completer/getFileCompletionsForPrefix";

const getLongestCommonPrefix = (completions: string[]) => {
  if (!completions.length) {
    return "";
  }

  let prefix = completions[0];

  for (let i = 1; i < completions.length; i++) {
    while (!completions[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) {
        return "";
      }
    }
  }

  return prefix;
};

export function createCustomTabCompleter(
  getRl: () => Interface,
): AsyncCompleter {
  let shouldShowListOnNextTab = false;

  return (line, callback) => {
    void (async () => {
      const trimmedLine = line.trim();
      // detect command or argument
      const lastChar = line.length ? line[line.length - 1] : "";

      const { commandName, args } = extractCommandProperties(line, false);

      let mode: "command" | "newArg" | "lastArg";

      if (!commandName) {
        mode = "command";
      } else {
        if (isWhitespace(lastChar) || lastChar === ">") {
          mode = "newArg";
        } else if (args.length) {
          mode = "lastArg";
        } else {
          mode = "command";
        }
      }

      try {
        let completions: string[];
        let commonPrefixComparator: string;
        if (mode === "command") {
          commonPrefixComparator = trimmedLine;
          completions = getBuiltinCommandCompletion(trimmedLine);

          if (!completions.length) {
            completions = await getPathCommandCompletion(trimmedLine);
          }
        } else {
          const filePrefix: string =
            mode === "lastArg" ? args[args.length - 1] : "";
          commonPrefixComparator = filePrefix;

          completions = await getFileCompletionsForPrefix(filePrefix);
        }

        // nothing found
        if (completions.length === 0) {
          shouldShowListOnNextTab = false;
          await ringBell();
          callback(null, [[], line]);
          return;
        }

        // perfect match
        if (completions.length === 1) {
          shouldShowListOnNextTab = false;
          if (mode === "command") {
            callback(null, [[`${completions[0]} `], line]);
          } else {
            callback(null, [
              [
                line.concat(
                  completions[0].slice(commonPrefixComparator.length),
                ),
              ],
              line,
            ]);
          }
          return;
        }

        // partial completions
        const commonPrefix = getLongestCommonPrefix(completions);
        if (commonPrefix.length > commonPrefixComparator.length) {
          const completion =
            mode === "command"
              ? commonPrefix
              : line.concat(commonPrefix.slice(commonPrefixComparator.length));
          callback(null, [[completion], line]);
          shouldShowListOnNextTab = true;
          return;
        }

        // needs second completions invocation to show full list
        if (!shouldShowListOnNextTab) {
          shouldShowListOnNextTab = true;
          await ringBell();
          callback(null, [[], line]);
          return;
        }

        shouldShowListOnNextTab = false;
        completions.sort();
        process.stdout.write(`\n${completions.join("  ")}\n`);
        callback(null, [[], line]);
        getRl().prompt(true);
      } catch (error) {
        callback(error as Error);
      }
    })();
  };
}
