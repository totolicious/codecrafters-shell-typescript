export const executeBinary = async ({
  executable,
  args,
}: {
  executable: string;
  args: string[];
}) => {
  const proc = Bun.spawn([executable, ...args], {
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  await proc.exited;
};
