import type { Completer } from "node:readline/promises";
import type { CompleterResult } from "node:readline";

import { ringBell } from "../repl/ringBell";
import { getBuiltinCommandCompletion } from "./getBuiltinCommandCompletion";
import { getPathCommandCompletion } from "./getPathCommandCompletion";

export const commandCompleter: Completer = async (
  line,
): Promise<CompleterResult> => {
  const trimmedLine = line.trim();
  const builtinCommands = getBuiltinCommandCompletion(trimmedLine);
  const pathCommands = await getPathCommandCompletion(trimmedLine);

  const commands = [...builtinCommands, ...pathCommands].sort();

  if (!commands.length) {
    ringBell();
    return [[], line];
  }

  return [commands.length === 1 ? [`${commands[0]} `] : commands, line];
};
