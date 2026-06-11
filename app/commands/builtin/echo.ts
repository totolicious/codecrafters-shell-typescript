import type { Command, CommandExecutionArguments } from "../../types";

export const echo: Command = ({ args, streams }: CommandExecutionArguments) => {
  streams.stdout.write(`${args.join(" ")}\n`);
  streams.stdout.end();
};
