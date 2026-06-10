import type { Command } from "../../types";

export const pwd: Command = (args: string[]) => {
  if (args.length > 0) {
    console.log("pwd: too many arguments");
    return;
  }

  console.log(process.cwd());
};
