import type { Command, CommandExecutionArguments } from "../../types";
import { isBuiltinCommand } from "../isBuiltinCommand";
import { getCommandPath } from "../getCommandPath";
import pEachSeries from "p-each-series";

const printCommandType = async (commandName: string) => {
  if (isBuiltinCommand(commandName)) {
    console.log(`${commandName} is a shell builtin`);
    return;
  }

  const path = await getCommandPath(commandName);
  if (path) {
    console.log(`${commandName} is ${path}`);
    return;
  }

  console.log(`${commandName}: not found`);
};

export const type: Command = async ({ args }: CommandExecutionArguments) => {
  await pEachSeries(args, printCommandType);
};
