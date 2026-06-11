import { finished } from "node:stream/promises";

import type { CommandStreams } from "../types";

export const endCommandStreams = async (
  commandStreams: CommandStreams,
): Promise<void> => {
  if (!commandStreams.stdout.writableEnded) {
    commandStreams.stdout.end();
  }
  if (!commandStreams.stderr.writableEnded) {
    commandStreams.stderr.end();
  }

  await Promise.all([
    finished(commandStreams.stdout),
    finished(commandStreams.stderr),
  ]);
};
