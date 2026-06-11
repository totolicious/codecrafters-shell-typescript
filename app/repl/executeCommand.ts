import { Interface } from "readline";
import type { CommandStreams } from "../types";
import { getBuiltinCommand } from "../commands/getBuiltinCommand";
import { isBinary } from "../commands/isBinary";
import { executeBinary } from "../commands/executeBinary";
import { commandNotFound } from "./errors/commandNotFound";
export const executeCommand = async ({
  commandName,
  args,
  rl,
  streams,
}: {
  commandName: string;
  args: string[];
  rl: Interface;
  streams: CommandStreams;
}): Promise<void> => {
  const builtinCommand = getBuiltinCommand(commandName);
  if (builtinCommand) {
    await builtinCommand({ args, rl, streams });
  } else if (await isBinary(commandName)) {
    await executeBinary({
      executable: commandName,
      args,
      streams,
    });
  } else {
    streams.stderr.write(`${commandNotFound(commandName)}\n`);
  }
};
