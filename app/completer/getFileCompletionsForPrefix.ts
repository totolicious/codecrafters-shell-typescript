import { promises as fs } from "fs";
import pEachSeries from "p-each-series";
import path from "path";

export const getFileCompletionsForPrefix = async (prefix: string) => {
  const files: string[] = [];
  try {
    const dirPath = process.cwd();
    const directory = await fs.readdir(dirPath);

    await pEachSeries(directory, async (entry) => {
      const fullPath = path.join(dirPath, entry);
      try {
        const stat = await fs.stat(fullPath);
        if (!stat.isFile()) {
          return;
        }

        if (entry.startsWith(prefix)) {
          files.push(entry);
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

  return files.sort();
};
