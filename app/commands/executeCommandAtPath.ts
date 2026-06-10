export const executeCommandAtPath = async ({
  path,
  args,
}: {
  path: string;
  args: string[];
}) => {
  const proc = Bun.spawn([path, ...args], {
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  await proc.exited;
};
