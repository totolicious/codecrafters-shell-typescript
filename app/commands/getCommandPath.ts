import { commandExistsAtPath } from "./commandExistsAtPath";
import fsPath from "path";
import pLocate from "p-locate";

export const getCommandPath = async (commandName: string) => {
  if (!process.env.PATH || process.env.PATH.length === 0) {
    return;
  }

  const pathItems = process.env.PATH.split(":");
  console.log(pathItems);
  const path = await pLocate(pathItems, async (testPath) => {
    console.log(testPath);
    const result = await commandExistsAtPath({ path: testPath, commandName });
    console.log(result);
    return result;
  });

  if (!path) {
    return;
  }

  return fsPath.join(path, commandName);
};
