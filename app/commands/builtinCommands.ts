import type { BuiltinCommandName, Command } from "../types";
import { exit, echo, type, pwd, cd } from "./builtin";

export const builtinCommands: Record<BuiltinCommandName, Command> = {
  exit,
  echo,
  type,
  pwd,
  cd,
};
