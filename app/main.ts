import { createInterface } from "readline";
import { evalCommand } from "./repl/evalCommand";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.on("line", async (line) => {
  await evalCommand(line, rl);
  rl.prompt();
});

// TODO: Uncomment the code below to pass the first stage
rl.prompt();
