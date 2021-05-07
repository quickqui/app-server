import { withStaticData } from "@quick-qui/data-provider";
import { parseRef, REF_RESOLVE, Info } from "@quick-qui/model-defines";
import assert, { fail } from "assert";
import * as yaml from "js-yaml";
import _ from "lodash";
import { resolve, resolveAsString } from "../Resolve";
import { env } from "../Env";
import p from "path";
import { log } from "../Util";
//TODO fake data provider 是一个implementation， 应该以什么方式跟front、app-server 连接？

export async function getFakeDataProvider(info: Info) {
  let fakeData = info.annotations?.implementation?.fakeData;

  if (fakeData) {
    if (typeof fakeData === "string") {
      const { protocol, path } = parseRef(fakeData)!;
      assert.equal(
        protocol,
        REF_RESOLVE,
        `only support resolve, but got "${protocol}"`
      );

      const modelFile = info.annotations?.["buildingContext"]?.modelFile;

      const base = modelFile
        ? p.resolve(env.extendPath, modelFile.relativeToModelDir)
        : env.extendPath;
      if (path.endsWith(".json")) {
        const dataString = await resolveAsString(path, base);
        fakeData = JSON.parse(dataString);
      } else if (path.endsWith(".yml") || path.endsWith(".yaml")) {
        const dataString = await resolveAsString(path, base);
        fakeData = yaml.load(dataString);
      } else {
        fakeData = await resolve(path, base);
      }
    }
  }
  if (!fakeData) fail("no fake data find");
  const dataProvider = withStaticData(fakeData).value();
  return dataProvider;
}
