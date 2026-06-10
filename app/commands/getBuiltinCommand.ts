import { builtinCommands } from "./builtinCommands";
import type { BuiltinCommandName } from "../types";

export const getBuiltinCommand = (commandName: string) => {
  return builtinCommands[commandName as BuiltinCommandName];
};
