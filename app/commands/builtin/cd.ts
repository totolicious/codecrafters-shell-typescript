import type { Command } from "../../types";

let oldPwd: string | undefined = process.cwd();

export const cd: Command = (args: string[]) => {
  if (args.length > 1) {
    console.log("cd: too many arguments");
    return;
  }

  let newPwd: string;

  // this points to HOME
  if (args[0] === "~" || !args[0]) {
    if (!process.env.HOME) {
      throw new Error("HOME env var is not set");
    }
    newPwd = process.env.HOME;
  } else if (args[0] === "-") {
    console.log(oldPwd);
    newPwd = oldPwd ?? process.cwd();
  } else {
    newPwd = args[0];
  }

  oldPwd = process.cwd();
  process.chdir(newPwd);
};
