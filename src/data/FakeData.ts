import {
  chain,
  DataProvider,
  forResource,
  withStaticData
} from "@quick-qui/data-provider";
import {
  parseRef,
  REF_RESOLVE,
  withExchangeModel
} from "@quick-qui/model-defines";
import assert from "assert";
import * as yaml from "js-yaml";
import _ from "lodash";
import { model } from "../Model";
import { resolve, resolveAsString } from "../Resolve";

//TODO fake data provider 是一个implementation， 应该以什么方式跟front、app-server 连接？

export const fakeDataDataProvider: Promise<
  DataProvider | undefined
> = (async () => {
  const exchangeModel = withExchangeModel(await model)?.exchangeModel;
  const exchanges =
    exchangeModel?.exchanges?.filter(exchange => {
      return exchange.to === "back" && exchange.from === "fake";
    }) ?? [];
  if (_.isEmpty(exchanges)) return undefined;
  const providers = exchanges.map(async exchange => {
    //TODO 支持faker，或者唯一支持faker
    //TODO  目前的实现方法，每次改了fake以后app-server需要重启，不太理想，设计到两个环节，一个是model要重取，一个是fake 的dp要支持动态。
    let fakeData = exchange.parameters?.["fakeData"];
    if (fakeData) {
      if (typeof fakeData === "string") {
        const { protocol, path } = parseRef(fakeData)!;
        assert.equal(
          protocol,
          REF_RESOLVE,
          `only support resolve, but got "${protocol}"`
        );
        const base =
          exchange.annotations?.["buildingContext"]?.modelFile?.repositoryBase;
        const dataString = await resolveAsString(path, base);
        if (path.endsWith(".json")) {
          fakeData = JSON.parse(dataString);
        } else if (path.endsWith(".yml") || path.endsWith(".yaml")) {
          fakeData = yaml.safeLoad(dataString);
        } else {
          fakeData = await resolve(path, base);
        }
      }
    }
    if (!fakeData) throw new Error("no fake data find");
    const dataProvider = withStaticData(fakeData).value();
    return forResource(exchange.resources, dataProvider);
  });

  return Promise.all(providers).then(dataPS => dataPS.reduce(chain));
})();
