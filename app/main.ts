import { createInterface, type Interface } from "node:readline";
import { evalCommand } from "./repl/evalCommand";
import { createCustomTabCompleter } from "./repl/customTabCompletion";

const rl: Interface = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
  completer: createCustomTabCompleter(() => rl),
});

rl.on("line", async (line) => {
  await evalCommand(line, rl);
  rl.prompt();
});

rl.prompt();
