import untildify from "untildify";

export const resolveShellPath = (shellPath: string): string => {
  return untildify(shellPath);
};
