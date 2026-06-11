import type { Command, CommandExecutionArguments } from "../../types";

export const pwd: Command = ({ args }: CommandExecutionArguments) => {
  if (args.length > 0) {
    console.log("pwd: too many arguments");
    return;
  }

  console.log(process.cwd());
};
