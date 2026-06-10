import { Interface } from "readline";
import { commandNotFound } from "../errors/commandNotFound";
import { getBuiltinCommand } from "../commands/getBuiltinCommand";
import { getCommandPath } from "../commands/getCommandPath";

export const evalCommand = async (line: string, rl: Interface) => {
  const trimmedLine = line.trim();
  const [commandName, ...args] = trimmedLine.split(/[ \t]+/);

  if (!commandName) {
    return;
  }

  const builtinCommand = getBuiltinCommand(commandName);
  if (builtinCommand) {
    await builtinCommand(args, rl);
    return;
  }

  const commandPath = await getCommandPath(commandName);
  if (commandPath) {
    // TODO: execute command
  }

  console.log(commandNotFound(trimmedLine));
};
