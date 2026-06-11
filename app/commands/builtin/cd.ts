import { isCodeError } from "../../errors/isCodeError";
import { resolveShellPath } from "../../path/resolveShellPath";
import type { Command, CommandExecutionArguments } from "../../types";

const OLDPWD_ALIAS = "-";

let oldPwd: string | undefined = process.cwd();

export const cd: Command = async ({ args }: CommandExecutionArguments) => {
  if (args.length > 1) {
    console.log("cd: too many arguments");
    return;
  }

  let newPwd: string;

  // no arg points to home
  if (!args[0]) {
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

  // if path starts with home dir
  newPwd = resolveShellPath(newPwd);

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
