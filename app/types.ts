import type { Interface } from "node:readline";
import type { RedirectionOperator } from "./repl/RedirectionOperator";
import type { PassThrough } from "node:stream";

type Awaitable<T> = T | Promise<T>;

export enum FileRedirectMode {
  Write = "write",
  Append = "append",
}

export const fileRedirectModeToFileOpenModeFlags = (
  fileRedirectMode: FileRedirectMode,
): "w" | "a" => {
  if (fileRedirectMode === FileRedirectMode.Append) {
    return "a";
  } else {
    return "w";
  }
};

export type FileRedirection = {
  filePath: string;
  redirectionOperator: RedirectionOperator;
};

export type CommandNameAndArgs = {
  commandName: string | undefined;
  args: string[];
  fileRedirections: FileRedirection[];
};

export type CommandExecutionArguments = {
  args: string[];
  streams: CommandStreams;
  rl: Interface;
};

export type Command = ({
  args,
  streams,
  rl,
}: CommandExecutionArguments) => Awaitable<void>;

export type Commands = Record<string, Command>;

export type CommandStreams = {
  stdout: PassThrough;
  stderr: PassThrough;
};

export const BUILTIN_COMMAND_NAMES = Object.freeze([
  "exit",
  "echo",
  "type",
  "pwd",
  "cd",
] as const);

export type BuiltinCommandName = (typeof BUILTIN_COMMAND_NAMES)[number];
