import { Interface } from "readline";
import { exit } from "../commands/exit";
import { commandNotFound } from "../errors/commandNotFound";

export const evalCommand = (line: string, rl: Interface) => {
  const trimmedLine = line.trim();

  if (trimmedLine === "exit") {
    exit(rl);
    return;
  }

  console.log(commandNotFound(trimmedLine));
};
