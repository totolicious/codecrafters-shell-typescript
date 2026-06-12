import type { AsyncCompleter, Interface } from "node:readline";

import { ringBell } from "./ringBell";
import { getBuiltinCommandCompletion } from "../completer/getBuiltinCommandCompletion";
import { getPathCommandCompletion } from "../completer/getPathCommandCompletion";

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
      try {
        let completions: string[] = getBuiltinCommandCompletion(trimmedLine);

        if (!completions.length) {
          completions = await getPathCommandCompletion(trimmedLine);
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
          callback(null, [[`${completions[0]} `], line]);
          return;
        }

        // partial completions
        const commonPrefix = getLongestCommonPrefix(completions);
        if (commonPrefix.length > trimmedLine.length) {
          callback(null, [[commonPrefix], line]);
          shouldShowListOnNextTab = false;
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
