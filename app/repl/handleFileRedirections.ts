import { Writable } from "node:stream";
import { resolveShellPath } from "../path/resolveShellPath";
import fs from "fs";
import {
  fileRedirectModeToFileOpenModeFlags,
  type CommandStreams,
  type FileRedirection,
} from "../types";
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

export const handleFileRedirections = async (
  fileRedirections: FileRedirection[],
  commandStreams: CommandStreams,
) => {
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
};
