import {
  chain,
  DataProvider,
  DataProviderParams,
  dp,
  forResource,
  restDp,
  withResourceMap,
} from "@quick-qui/data-provider";
import {
  Exchange,
  parseRef,
  REF_RESOLVE,
  withExchangeModel,
} from "@quick-qui/model-defines";
import assert from "assert";
import _ from "lodash";
import { model } from "../Model";
import { resolve } from "../Resolve";
import { fakeDataDataProvider } from "./FakeData";
import { env } from "../Env";
import p from "path";

const backEndDataProvider: DataProvider = (
  type: string,
  resource: string,
  params: DataProviderParams<unknown>
) => {
  //TODO 连上后面的dp，比如database的。
  throw new Error(
    `no data provider find - ${JSON.stringify({ type, resource, ...params })}`
  );
};
const thisEndDataProvider: Promise<DataProvider | undefined> = (async () => {
  const exchangeModel = withExchangeModel(await model)?.exchangeModel;
  const exchanges =
    exchangeModel?.exchanges?.filter((exchange) => {
      return exchange.to === "back" && exchange.from !== "fake";
    }) ?? [];
  if (_.isEmpty(exchanges)) return undefined;
  const providers = exchanges.map(async (exchange: Exchange) => {
    if (exchange.annotations?.["implementation"]) {
      //TODO 支持extension以外的方式， 比如rest，graphql
      const { protocol, path } = parseRef(
        exchange.annotations?.["implementation"]!
      );
      assert.equal(
        protocol,
        REF_RESOLVE,
        `only support resolve, but got "${protocol}"`
      );
      const modelFile = exchange.annotations?.["buildingContext"]?.modelFile;
      const base = modelFile
        ? p.resolve(env.extendPath, modelFile.relativeToModelDir)
        : env.extendPath;
      const dataProvider = await resolve<DataProvider>(path, base);
      return forResource(exchange.resources, dataProvider);
    }
  });
  return Promise.all(providers).then((dataPS) => dataPS.reduce(chain));
})();

export const dataProvider: Promise<DataProvider> = fakeDataDataProvider.then(
  (fakeDp) =>
    thisEndDataProvider.then((thisEndDp) => {
      return dp(fakeDp).chain(dp(thisEndDp)).chain(backEndDataProvider).value();
    })
);
