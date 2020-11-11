import _ from "lodash";
import { filterObject, no, log } from "./Util";

export const env: {
  modelUrl: string;
  extendPath: string;
  implementationName?: string;
} = (() => {
  let defaults: any = {};
  defaults = {
    modelUrl: "http://localhost:1111",
  };
  log.debug(JSON.stringify(process.env, undefined, 2));
  return _.assign(
    {},
    defaults,
    filterObject({
      implementationName: process.env.IMPLEMENTATION_NAME,
      modelUrl: process.env.MODEL_URL,
      extendPath:
        (process.env.EXTEND_PATH || process.env.MODEL_PATH) ?? no("MODEL_PATH"),
    })
  );
})();
