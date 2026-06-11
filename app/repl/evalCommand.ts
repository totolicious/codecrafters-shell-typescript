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
import { finished } from "node:stream/promises";
import fs from "fs";
import { RedirectionOperatorStreamType } from "./RedirectionOperator";

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
  for (const fr of fileRedirections) {
    const path = resolveShellPath(fr.filePath);

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
  }

  // redirection step 2 - only write to target streams
  commandStreams.stdout.pipe(outputStreamTarget, {
    end: outputStreamTarget !== process.stdout,
  });
  commandStreams.stderr.pipe(errorStreamTarget, {
    end: errorStreamTarget !== process.stderr,
  });

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
