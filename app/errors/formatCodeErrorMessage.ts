import { isCodeError } from "./isCodeError";

type FormatCodeErrorMessageOptions = {
  path: string;
  prefix?: string;
};

export const formatCodeErrorMessage = (
  error: unknown,
  { path, prefix }: FormatCodeErrorMessageOptions,
): string | undefined => {
  if (!isCodeError(error)) {
    return undefined;
  }

  const prefixSegment = prefix ? `${prefix}: ` : "";

  switch (error.code) {
    case "ENOENT":
      return `${prefixSegment}${path}: No such file or directory`;
    case "ENOTDIR":
      return `${prefixSegment}not a directory: ${path}`;
    default:
      return undefined;
  }
};
