export const isCodeError = (err: unknown) =>
  Error.isError(err) && "code" in err;
