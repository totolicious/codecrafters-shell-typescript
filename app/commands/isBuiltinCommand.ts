import { BUILTIN_COMMAND_NAMES, type BuiltinCommandName } from "../types";

export const isBuiltinCommand = (commandName: string) => {
  return BUILTIN_COMMAND_NAMES.includes(commandName as BuiltinCommandName);
};
