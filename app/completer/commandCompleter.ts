import type { Completer, CompleterResult } from "readline";
import { BUILTIN_COMMAND_NAMES } from "../types";
import { ringBell } from "../repl/ringBell";

export const commandCompleter: Completer = (line): CompleterResult => {
  const trimmedLine = line.trim();
  const commands = BUILTIN_COMMAND_NAMES.filter((builtinCommand) => {
    return builtinCommand.startsWith(trimmedLine);
  });

  if (!commands.length) {
    ringBell();
    return [[], line];
  }

  return [commands.length === 1 ? [`${commands[0]} `] : commands, line];
};
