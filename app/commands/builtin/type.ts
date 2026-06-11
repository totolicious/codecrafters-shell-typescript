import type { Command, CommandExecutionArguments } from "../../types";
import { isBuiltinCommand } from "../isBuiltinCommand";
import { getCommandPath } from "../getCommandPath";
import pEachSeries from "p-each-series";

export const type: Command = async ({
  args,
  streams,
}: CommandExecutionArguments) => {
  await pEachSeries(args, async (commandName) => {
    if (isBuiltinCommand(commandName)) {
      streams.stdout.write(`${commandName} is a shell builtin\n`);
      return;
    }

    const path = await getCommandPath(commandName);
    if (path) {
      streams.stdout.write(`${commandName} is ${path}\n`);
      return;
    }

    streams.stderr.write(`${commandName}: not found\n`);
  });
};
