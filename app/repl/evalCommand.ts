import { Interface } from "readline";
import { commandNotFound } from "../errors/commandNotFound";
import type { Command } from "../types";
import { echo, exit } from "../commands";

const commands: Record<string, Command> = {
  exit,
  echo,
};

export const evalCommand = (line: string, rl: Interface) => {
  const trimmedLine = line.trim();
  const [commandName, ...args] = trimmedLine.split(/[ \t]+/);

  if (!commandName) {
    return;
  }

  const command = commands[commandName];

  if (command) {
    command(args, rl);
    return;
  }

  if (trimmedLine === "exit") {
    exit(args, rl);
    return;
  }

  console.log(commandNotFound(trimmedLine));
};
