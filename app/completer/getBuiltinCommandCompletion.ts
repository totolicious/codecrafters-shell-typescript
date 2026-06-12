import { BUILTIN_COMMAND_NAMES } from "../types";

export const getBuiltinCommandCompletion = (line: string) => {
  const commands = BUILTIN_COMMAND_NAMES.filter((builtinCommand) => {
    return builtinCommand.startsWith(line);
  });

  return commands;
};
