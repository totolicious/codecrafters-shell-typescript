import type { Command, CommandExecutionArguments } from "../../types";

export const exit: Command = ({
  args,
  rl,
  streams,
}: CommandExecutionArguments) => {
  if (args.length <= 1) {
    rl.close();
    process.exit(args[0] ?? 0);
  }

  if (args.length !== 1) {
    streams.stdout.write("exit: expected 1 argument\n");
    return;
  }
};
