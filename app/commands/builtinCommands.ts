import type { BuiltinCommandName, Command } from "../types";
import { exit, echo, type } from "./builtin";

export const builtinCommands: Record<BuiltinCommandName, Command> = {
  exit,
  echo,
  type,
};
