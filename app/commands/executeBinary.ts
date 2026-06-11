import type { CommandStreams } from "../types";

import { Writable } from "node:stream";
import type { PassThrough } from "node:stream";
const toWebWritable = (s: PassThrough) => Writable.toWeb(s) as WritableStream;

export const executeBinary = async ({
  executable,
  args,
  streams,
}: {
  executable: string;
  args: string[];
  streams: CommandStreams;
}) => {
  const proc = Bun.spawn([executable, ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });

  proc.stderr.pipeTo(toWebWritable(streams.stderr));
  proc.stdout.pipeTo(toWebWritable(streams.stdout));

  await proc.exited;
};
