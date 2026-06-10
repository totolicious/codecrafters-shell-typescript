import { Interface } from "readline";
import { commandNotFound } from "./errors/commandNotFound";
import { getBuiltinCommand } from "../commands/getBuiltinCommand";
import { executeBinary } from "../commands/executeBinary";
import { isBinary } from "../commands/isBinary";

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

  if (await isBinary(commandName)) {
    await executeBinary({ executable: commandName, args });
    return;
  }

  console.log(commandNotFound(trimmedLine));
};
