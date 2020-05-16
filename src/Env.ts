import _ from "lodash";
import { filterObject, no } from "./Util";

export const env: {
  modelUrl: string;
  extendPath: string;
} = (() => {
  let defaults: any = {};
  defaults = {
    modelUrl: "http://localhost:1111"
  };
  console.log(JSON.stringify(process.env,undefined,2))
  return _.assign(
    {},
    defaults,
    filterObject({
      modelUrl: process.env.MODEL_URL,
      extendPath: (process.env.EXTEND_PATH || process.env.MODEL_PATH)?? no("MODEL_PATH")
    })
  );
})();
