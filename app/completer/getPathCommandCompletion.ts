import { promises as fs } from "fs";
import path from "path";
import pEachSeries from "p-each-series";

export const getPathCommandCompletion = async (
  line: string,
): Promise<string[]> => {
  if (!process.env.PATH) {
    throw new Error(`PATH env var is not defined`);
  }

  const pathDirectories = [process.cwd(), ...process.env.PATH.split(":")];
  const executables: string[] = [];
  await pEachSeries(pathDirectories, async (dirPath) => {
    try {
      const entries = await fs.readdir(dirPath);
      await pEachSeries(entries, async (entry) => {
        const fullPath = path.join(dirPath, entry);
        try {
          const stat = await fs.stat(fullPath);
          if (!stat.isFile()) {
            return;
          }
          await fs.access(fullPath, fs.constants.X_OK);

          if (entry.startsWith(line)) {
            executables.push(entry);
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // fail silently, skip file
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // fail silently, skip directory
    }
  });

  return executables;
};
