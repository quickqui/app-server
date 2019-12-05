import { env } from "./Env";
function _interopRequireDefault(obj: any) {
  console.log(obj);
  return obj && obj.__esModule ? obj : { default: obj };
}

export const resolve = <T extends unknown>(path: string): Promise<T> => {
  // if (env.name === "dev_local") {
  //   return import(
  //     `../../../../huadahengxinProjects/fake-device-general/dist/${path}`
  //   ).then(obj => _interopRequireDefault(obj).default as T);
  // }
  if (env.name === "dev_docker") {
      return import(`../../../extendDir/dist/${path}`).then(obj => _interopRequireDefault(obj).default as T);
  }
  throw new Error("Only can resolve an known path");
};
