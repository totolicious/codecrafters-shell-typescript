import type { Interface } from "node:readline";
import { extractCommandProperties } from "./extractCommandProperties";
import { createCommandStreams } from "./createCommandStreams";

import { handleFileRedirections } from "./handleFileRedirections";
import { endCommandStreams } from "./endCommandStreams";
import { executeCommand } from "./executeCommand";

export const evalCommand = async (line: string, rl: Interface) => {
  const trimmedLine = line.trim();
  const { commandName, args, fileRedirections } =
    extractCommandProperties(trimmedLine);

  if (!commandName) {
    return;
  }

  const commandStreams = createCommandStreams();

  await handleFileRedirections(fileRedirections, commandStreams);

  await executeCommand({
    commandName,
    args,
    streams: commandStreams,
    rl,
  });

  await endCommandStreams(commandStreams);
};
