import parse from "url-parse";
import waitPort from "wait-port";

export function filterObject(obj: any) {
  const ret: any = {};
  Object.keys(obj)
    .filter((key) => obj[key] !== undefined)
    .forEach((key) => (ret[key] = obj[key]));
  return ret;
}

export function no(name: string) {
  throw new Error(`env not found - ${name}`);
}

export function waitForUrlPort(urlString: string): Promise<any> {
  const url = parse(urlString);
  const params = {
    host: url.hostname,
    port: +url.port,
  };
  return waitPort(params);
}



export const log = require('debug-logger')('quick-qui:app-server')


export function notNil<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}