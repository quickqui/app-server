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
  return _.assign(
    {},
    defaults,
    filterObject({
      modelUrl: process.env.MODEL_URL,
      extendPath: process.env.EXTEND_PATH ?? no("EXTEND_PATH")
    })
  );
})();
