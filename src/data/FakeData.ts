import {
  DataProvider,
  chain,
  forResource,
  withStaticData
} from "@quick-qui/data-provider";
import { model } from "../Model";
import { withExchangeModel, REF_RESOLVE } from "@quick-qui/model-defines";
import _ from "lodash";
import { resolve } from "../Resolve";
import { parseRef } from "@quick-qui/model-defines";
import assert from "assert";

//TODO fakedata provider 是一个implementation， 应该以什么方式跟front、app-server 连接？

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
        fakeData = await resolve(path, base);
      }
    }
    if (!fakeData) throw new Error("no fake data find");
    const dataProvider = withStaticData(fakeData).value();
    return forResource(exchange.resources, dataProvider);
  });

  return Promise.all(providers).then(dataPS => dataPS.reduce(chain));
})();
