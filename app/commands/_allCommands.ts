import type { Command } from "../types";
import { exit } from "./exit";
import { echo } from "./echo";
import { type } from "./type";

export const allCommands: Record<string, Command> = {
  exit,
  echo,
  type,
};
