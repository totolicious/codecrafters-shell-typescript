import { createInterface } from "readline";
import { commandNotFound } from "./errors/commandNotFound";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.on("line", (line) => {
  commandNotFound(line);
});

// TODO: Uncomment the code below to pass the first stage
rl.prompt();
