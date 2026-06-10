import { getCommandPath } from "./getCommandPath";

export const isBinary = async (executableCommand: string): Promise<boolean> => {
  const path = await getCommandPath(executableCommand);
  return !!path;
};
