import { Interface } from "readline";

type Awaitable<T> = T | Promise<T>;

export type Command = (args: string[], rl: Interface) => Awaitable<void>;

export type Commands = Record<string, Command>;

export const BUILTIN_COMMAND_NAMES = Object.freeze([
  "exit",
  "echo",
  "type",
  "pwd",
] as const);

export type BuiltinCommandName = (typeof BUILTIN_COMMAND_NAMES)[number];
