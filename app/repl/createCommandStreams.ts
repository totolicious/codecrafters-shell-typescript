import type { CommandStreams } from "../types";
import { PassThrough } from "node:stream";

export const createCommandStreams = (): CommandStreams => {
  const stdout = new PassThrough();
  const stderr = new PassThrough();
  return {
    stdout,
    stderr,
  };
};
