import { Interface } from "readline";

export type Command = (args: string[], rl: Interface) => void;

export type Commands = Record<string, Command>;
