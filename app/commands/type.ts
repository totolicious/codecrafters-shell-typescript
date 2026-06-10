import type { Command } from "../types";
import { allCommands } from "./_allCommands";

export const type: Command = (args: string[]) => {
  const commandName = args[0];
  if (allCommands[commandName] !== undefined) {
    console.log(`${commandName} is a shell built-in`);
    return;
  }

  console.log(`${commandName}: not found`);
};
