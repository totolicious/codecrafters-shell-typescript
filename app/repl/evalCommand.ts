import { Interface } from "readline";
import { commandNotFound } from "./errors/commandNotFound";
import { getBuiltinCommand } from "../commands/getBuiltinCommand";
import { executeBinary } from "../commands/executeBinary";
import { isBinary } from "../commands/isBinary";
import { extractCommandProperties } from "./extractCommandProperties";
import { createCommandStreams } from "./createCommandStreams";
import { resolveShellPath } from "../path/resolveShellPath";
import { fileRedirectModeToFileOpenModeFlags } from "../types";
import type { Writable } from "node:stream";
import fs from "fs";
import { RedirectionOperatorStreamType } from "./RedirectionOperator";
import { once } from "node:events";

function streamFinished(stream: Writable) {
  return once(stream, "finish");
}

export const evalCommand = async (line: string, rl: Interface) => {
  const trimmedLine = line.trim();
  const { commandName, args, fileRedirections } =
    extractCommandProperties(trimmedLine);

  if (!commandName) {
    return;
  }

  // create the command streams
  const commandStreams = createCommandStreams();

  let outputStreamTarget: Writable = process.stdout;
  let errorStreamTarget: Writable = process.stderr;

  // redirection step 1 - create all files
  const writeStreams = fileRedirections.map((fr) => {
    const path = resolveShellPath(fr.filePath);

    // create file streams
    const stream = fs.createWriteStream(path, {
      flags: fileRedirectModeToFileOpenModeFlags(fr.redirectionOperator.mode),
    });

    if (
      fr.redirectionOperator.streamType === RedirectionOperatorStreamType.Stdout
    ) {
      outputStreamTarget = stream;
    } else {
      errorStreamTarget = stream;
    }

    return stream;
  });

  // redirection step 2 - only write to target streams
  const streamsFinishedPromises = [
    once(outputStreamTarget, "finish"),
    once(errorStreamTarget, "finish"),
  ];

  commandStreams.stdout.pipe(outputStreamTarget);
  commandStreams.stderr.pipe(errorStreamTarget);

  // execute commands
  const builtinCommand = getBuiltinCommand(commandName);
  if (builtinCommand) {
    await builtinCommand({ args, rl, streams: commandStreams });
  } else if (await isBinary(commandName)) {
    await executeBinary({
      executable: commandName,
      args,
      streams: commandStreams,
    });
  } else {
    console.log(commandNotFound(commandName));
    return;
  }

  // redirection step 3 - close all streams
  writeStreams.forEach((stream) => stream.close());

  // wait for stream write promises to finish
  await Promise.all(streamsFinishedPromises);
};
