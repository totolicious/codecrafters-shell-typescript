import type { Completer, CompleterResult } from "readline";
import { BUILTIN_COMMAND_NAMES } from "../types";

export const commandCompleter: Completer = (line): CompleterResult => {
  const trimmedLine = line.trim();
  const commands = BUILTIN_COMMAND_NAMES.filter((builtinCommand) => {
    return builtinCommand.startsWith(trimmedLine);
  });

  return [commands.length === 1 ? [`${commands[0]} `] : commands, line];
};
