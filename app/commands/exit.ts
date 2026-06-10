import { Interface } from "readline";

export const exit = (rl: Interface) => {
  rl.close();
  process.exit(0);
};
