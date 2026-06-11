import { formatCodeErrorMessage } from "../../errors/formatCodeErrorMessage";
import { isCodeError } from "../../errors/isCodeError";
import { resolveShellPath } from "../../path/resolveShellPath";
import type { Command, CommandExecutionArguments } from "../../types";

const OLDPWD_ALIAS = "-";

let oldPwd: string | undefined = process.cwd();

export const cd: Command = async ({
  args,
  streams,
}: CommandExecutionArguments) => {
  if (args.length > 1) {
    streams.stderr.write("cd: too many arguments");
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
    streams.stdout.write(oldPwd);
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

    const message = formatCodeErrorMessage(error, {
      path: newPwd,
      prefix: "cd",
    });
    if (message === undefined) {
      throw error;
    }
    streams.stderr.write(message);
  }
};
