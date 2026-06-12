import type { Completer } from "node:readline/promises";
import type { CompleterResult } from "node:readline";

import { ringBell } from "../repl/ringBell";
import { getBuiltinCommandCompletion } from "./getBuiltinCommandCompletion";
import { getPathCommandCompletion } from "./getPathCommandCompletion";

// This is the correct form of the completion handler. The builtin and binary commands should be mixed to form a single array of sorted results
// The exercise wants to first look at the builtin commands, and if none are found, look at the binary commands - which is NOT the correct behaviour
// export const commandCompleter: Completer = async (
//   line,
// ): Promise<CompleterResult> => {
//   const trimmedLine = line.trim();
//   const builtinCommands = getBuiltinCommandCompletion(trimmedLine);
//   const pathCommands = await getPathCommandCompletion(trimmedLine);

//   const commands = [...builtinCommands, ...pathCommands].sort();

//   if (!commands.length) {
//     ringBell();
//     return [[], line];
//   }

//   return [commands.length === 1 ? [`${commands[0]} `] : commands, line];
// };

// code adjusted to fit the exercise incorrect requirements

export const commandCompleter: Completer = async (
  line,
): Promise<CompleterResult> => {
  const trimmedLine = line.trim();
  const builtinCommands = getBuiltinCommandCompletion(trimmedLine);

  if (builtinCommands.length) {
    return [
      builtinCommands.length === 1
        ? [`${builtinCommands[0]} `]
        : builtinCommands,
      line,
    ];
  }

  const pathCommands = await getPathCommandCompletion(trimmedLine);
  return [
    pathCommands.length === 1 ? [`${pathCommands[0]} `] : pathCommands,
    line,
  ];
};
