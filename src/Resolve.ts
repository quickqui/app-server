import * as path from "path";
import fs from "fs";
function _interopRequireDefault(obj: any) {
  return obj?.__esModule || obj?.default ? obj : { default: obj };
}
export const resolveAsString = (
  pathStr: string,
  baseDir: string = "."
): Promise<string> => {
  let re = findInPath(baseDir, pathStr);
  return fs.promises.readFile(re).then(_ => _.toString());
};
export const resolve = <T extends unknown>(
  pathStr: string,
  baseDir: string = "."
): Promise<T> => {
  let re = findInPath(baseDir, pathStr);
  return import(re).then(obj => _interopRequireDefault(obj).default as T);
};
function findInPath(baseDir: string, pathStr: string): string {
  let re = tryResolve(path.resolve(baseDir, pathStr));
  if (!re) {
    re = tryResolve(path.resolve(baseDir, "..", pathStr));
  }
  if (!re) {
    re = tryResolve(path.resolve(baseDir, "../dist", pathStr));
  }
  if (!re) {
    throw new Error(`can not find module, path=${pathStr} ,baseDir=${baseDir}`);
  }
  return re;
}

function tryResolve(name: string): string | undefined {
  try {
    return require.resolve(name);
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND") {
      return undefined;
    } else {
      throw err;
    }
  }
}
