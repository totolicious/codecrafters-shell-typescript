import { createInterface } from "readline";
import { commandNotFound } from "./errors/commandNotFound";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.on("line", (line) => {
  console.log(commandNotFound(line));
  rl.prompt();
});

// TODO: Uncomment the code below to pass the first stage
rl.prompt();
