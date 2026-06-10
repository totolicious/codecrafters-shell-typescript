import { promises as fs } from "fs";
import fsPath from "path";

export const commandExistsAtPath = async ({
  path,
  commandName,
}: {
  path: string;
  commandName: string;
}) => {
  if (!path || !commandName) {
    return false;
  }

  // check if path exists and is executable
  const executablePath = fsPath.join(path, commandName);
  try {
    await fs.access(executablePath, fs.constants.R_OK | fs.constants.X_OK);
    return true;
  } catch (error) {
    return false;
  }
};
