import _ from "lodash";

import { model } from "../Model";
import { resolve } from "../Resolve";
import {
  DataProvider,
  DataProviderParams,
  chain,
  forResource
} from "@quick-qui/data-provider";
import { withExchangeModel, Exchange } from "@quick-qui/model-defines";
import { fakeDataDataProvider } from "./FakeData";
import {
  emptyDataProvider,
  w
} from "@quick-qui/data-provider/dist/dataProvider/Wrapper";
const backEndDataProvider: DataProvider = (
  type: string,
  resource: string,
  params: DataProviderParams
) => {
  //TODO 连上后面的dp，比如database的。
  throw new Error("not implemented");
};
const thisEndDataProvider: Promise<DataProvider | undefined> = (async () => {
  const exchangeModel = withExchangeModel(await model)?.exchangeModel;
  const exchanges =
    exchangeModel?.exchanges?.filter(exchange => {
      return exchange.to === "back" && exchange.from !== "fake";
    }) ?? [];
  if (_.isEmpty(exchanges)) return undefined;
  const providers = exchanges.map(async (exchange: Exchange) => {
    //TODO 支持extension以外的方式
    const base =
      exchange.annotations?.["buildingContext"]?.modelFile?.repositoryBase;
    const dataProvider = await resolve<DataProvider>(exchange.extension!, base);
    return forResource(exchange.resources, dataProvider);
  });

  return Promise.all(providers).then(dataPS => dataPS.reduce(chain));
})();

export const dataProvider: Promise<DataProvider> = fakeDataDataProvider.then(
  fd =>
    thisEndDataProvider.then(dp => {
      return w(fd)
        .chain(w(dp))
        .chain(backEndDataProvider)
        .value();
    })
);
