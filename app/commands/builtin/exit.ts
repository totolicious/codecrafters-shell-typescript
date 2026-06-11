import type { Command, CommandExecutionArguments } from "../../types";

export const exit: Command = ({ args, rl }: CommandExecutionArguments) => {
  if (args.length <= 1) {
    rl.close();
    process.exit(args[0] ?? 0);
  }

  if (args.length !== 1) {
    console.log("exit: expected 1 argument");
    return;
  }
};
