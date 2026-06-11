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
import { formatCodeErrorMessage } from "../errors/formatCodeErrorMessage";
import { RedirectionOperatorStreamType } from "./RedirectionOperator";

const openWriteStream = (
  path: string,
  flags: "w" | "a",
): Promise<fs.WriteStream> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(path, { flags });
    stream.once("open", () => resolve(stream));
    stream.once("error", reject);
  });
};

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

    let stream: fs.WriteStream;
    try {
      stream = await openWriteStream(
        path,
        fileRedirectModeToFileOpenModeFlags(fr.redirectionOperator.mode),
      );
    } catch (error) {
      const message = formatCodeErrorMessage(error, { path }) ?? String(error);
      process.stderr.write(`${message}\n`);
      return;
    }

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
    commandStreams.stderr.write(`${commandNotFound(commandName)}\n`);
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
