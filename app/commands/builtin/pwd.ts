import type { Command, CommandExecutionArguments } from "../../types";

export const pwd: Command = ({ args, streams }: CommandExecutionArguments) => {
  if (args.length > 0) {
    streams.stderr.write("pwd: too many arguments");
    return;
  }

  streams.stdout.write(process.cwd());
};
