import {
  chain,
  DataProvider,
  DataProviderParams,
  dp,
  forResource,
} from "@quick-qui/data-provider";
import {
  withInfoModel,
  Info,
  parseRefWithProtocolInsure,
  evaluateInObject,
} from "@quick-qui/model-defines";
import { fail } from "assert";
import _ from "lodash";
import { model } from "../Model";
import { resolve } from "../Resolve";
import { getFakeDataProvider } from "./FakeData";
import { notNil } from "../Util";
import { implementationGlobal } from "@quick-qui/implementation-model";
import { fileDp } from "@quick-qui/data-provider/dist/lowdbDP/fileDP";
import path from "path";

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
  const infoModel = withInfoModel(await model)?.infoModel;
  const infos =
    infoModel?.infos?.filter((info) => {
      return (
        //TODO event 如何实现？
        info.type === "resource" &&
        info.annotations?.implementation?.at === "back"
      );
    }) ?? [];
  if (_.isEmpty(infos)) return undefined;
  const providers: Promise<DataProvider | undefined>[] =
    infos.map(getDataProvider);

  return Promise.all(providers).then((dataPS) =>
    dataPS.filter(notNil).reduce(chain)
  );
})();
export const dataProvider: Promise<DataProvider> = thisEndDataProvider.then(
  (thisEndDp) => {
    return dp(thisEndDp).chain(backEndDataProvider).value();
  }
);
async function getDataProvider(info: Info): Promise<DataProvider | undefined> {
  let dataProvider: DataProvider | undefined = undefined;
  // console.log(info.annotations?.buildingContext)
  const base = info.annotations?.buildingContext?.modelFile?.repositoryBase;
  if (info.annotations?.implementation?.source?.startsWith("resolve"))
    dataProvider = await resolve<DataProvider>(
      parseRefWithProtocolInsure(info.annotations?.implementation?.source).path,
      base
    );
  else if (info.annotations?.implementation?.source === "fake") {
    dataProvider = await getFakeDataProvider(info);
  } else if (info.annotations?.implementation?.source === "storage") {
    if (info.scope === "config") {
      // dataProvider = localStorageDp.value();
      fail("not supported");
    } else if (info.scope === "session") {
      // dataProvider = sessionStorageDp.value();
      fail("not supported");
    } else if (info.scope === "domain") {
      let init: any = undefined;
      if (info.default) {
        init = ( 
          await evaluateInObject(info.default, {
            env: implementationGlobal.env,
            dp: implementationGlobal.dp,
          })
        )[0];
      }
      dataProvider = fileDp(
        path.resolve(process.env.MODEL_PATH ?? ".", info.name + ".db"),
        init
      );
    }
  }
  if (!dataProvider) return undefined;
  return forResource(info.resources!, dataProvider!);
}
