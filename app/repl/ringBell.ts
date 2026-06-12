export const ringBell = () => {
  process.stderr.write("\x07");
};
