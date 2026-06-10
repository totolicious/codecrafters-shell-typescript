import { isCodeError } from "../../errors/isCodeError";
import type { Command } from "../../types";

const HOMEDIR_ALIAS = "~";
const OLDPWD_ALIAS = "-";

let oldPwd: string | undefined = process.cwd();

export const cd: Command = async (args: string[]) => {
  if (args.length > 1) {
    console.log("cd: too many arguments");
    return;
  }

  let newPwd: string;

  // this points to HOME
  if (args[0] === HOMEDIR_ALIAS || !args[0]) {
    if (!process.env.HOME) {
      throw new Error("HOME env var is not set");
    }
    newPwd = process.env.HOME;
  } else if (args[0] === OLDPWD_ALIAS) {
    console.log(oldPwd);
    newPwd = oldPwd ?? process.cwd();
  } else {
    newPwd = args[0];
  }

  const oldPwdCandidate = process.cwd();
  try {
    process.chdir(newPwd);
    oldPwd = oldPwdCandidate;
  } catch (error) {
    if (!isCodeError(error)) {
      throw error;
    }

    switch (error.code) {
      case "ENOTDIR": {
        console.log(`cd: not a directory: ${newPwd}`);
        break;
      }
      case "ENOENT": {
        console.log(`cd: ${newPwd}: No such file or directory`);
        break;
      }
      default: {
        throw error;
      }
    }
  }
};
