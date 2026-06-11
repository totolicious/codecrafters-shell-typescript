import { FileRedirectMode } from "../types";

export enum RedirectionOperatorStreamType {
  Stdout = "Stdout",
  Stderr = "Stderr",
}

export class RedirectionOperator {
  constructor(
    public fileDescriptor: number,
    public token: string,
    public mode: FileRedirectMode,
  ) {}

  public get displayName() {
    return `${this.token}`;
  }

  public get streamType(): RedirectionOperatorStreamType {
    if (this.fileDescriptor === 1) {
      return RedirectionOperatorStreamType.Stdout;
    }

    return RedirectionOperatorStreamType.Stderr;
  }

  /**
   * @returns all supported redirection operators
   */
  static getAll() {
    const createRedirectionOperators = (
      fileDescriptor: number,
      symbols: string[],
      mode: FileRedirectMode,
    ): RedirectionOperator[] => {
      return symbols.map(
        (symbol) => new RedirectionOperator(fileDescriptor, symbol, mode),
      );
    };

    const RO1_SYMBOLS_WRITE = ["1>", ">"];
    const RO2_SYMBOLS_WRITE = ["2>"];
    const RO1_SYMBOLS_APPEND = ["1>>", ">>"];
    const RO2_SYMBOLS_APPEND = ["2>>"];

    const allRedirectionOperators = [
      ...createRedirectionOperators(
        1,
        RO1_SYMBOLS_WRITE,
        FileRedirectMode.Write,
      ),
      ...createRedirectionOperators(
        2,
        RO2_SYMBOLS_WRITE,
        FileRedirectMode.Write,
      ),
      ...createRedirectionOperators(
        1,
        RO1_SYMBOLS_APPEND,
        FileRedirectMode.Append,
      ),
      ...createRedirectionOperators(
        2,
        RO2_SYMBOLS_APPEND,
        FileRedirectMode.Append,
      ),
    ].sort((a, b) => {
      return a.token.length < b.token.length ? 1 : -1;
    });

    return allRedirectionOperators;
  }
}
