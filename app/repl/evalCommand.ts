import { Interface } from "readline";
import { commandNotFound } from "../errors/commandNotFound";
import { allCommands } from "../commands/_allCommands";

export const evalCommand = (line: string, rl: Interface) => {
  const trimmedLine = line.trim();
  const [commandName, ...args] = trimmedLine.split(/[ \t]+/);

  if (!commandName) {
    return;
  }

  const command = allCommands[commandName];

  if (command) {
    command(args, rl);
    return;
  }

  console.log(commandNotFound(trimmedLine));
};
