import { Interface } from "readline";
import type { Command } from "../../types";

export const exit: Command = (args: string[], rl: Interface) => {
  if (args.length <= 1) {
    rl.close();
    process.exit(args[0] ?? 0);
  }

  if (args.length !== 1) {
    console.log("exit: expected 1 argument");
    return;
  }
};
