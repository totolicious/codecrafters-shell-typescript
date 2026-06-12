import type { AsyncCompleter, Interface } from "node:readline";

import { ringBell } from "./ringBell";
import { getBuiltinCommandCompletion } from "../completer/getBuiltinCommandCompletion";
import { getPathCommandCompletion } from "../completer/getPathCommandCompletion";

export function createCustomTabCompleter(
  getRl: () => Interface,
): AsyncCompleter {
  let lastKeyWasTab = false;

  return (line, callback) => {
    void (async () => {
      const trimmedLine = line.trim();
      try {
        let completions: string[] = getBuiltinCommandCompletion(trimmedLine);
        if (completions.length) {
          return completions;
        }

        completions = await getPathCommandCompletion(trimmedLine);

        if (completions.length === 0) {
          lastKeyWasTab = false;
          await ringBell();
          callback(null, [[], line]);
          return;
        }

        if (completions.length === 1) {
          lastKeyWasTab = false;
          callback(null, [[`${completions[0]} `], line]);
          return;
        }

        if (!lastKeyWasTab) {
          lastKeyWasTab = true;
          await ringBell();
          callback(null, [[], line]);
          return;
        }

        lastKeyWasTab = false;
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
