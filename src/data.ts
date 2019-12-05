import { env } from "./Env";


import fetch from "node-fetch";
import { createHttpLink } from "apollo-link-http";
import * as _ from "lodash";

import { model } from "./Model";
import { DataProvider, forResource, chain } from "@quick-qui/data-provider";
import { resolve } from "./Resolve";
import { emptyDataProvider } from "@quick-qui/data-provider/dist/dataProvider/Wrapper";


// const fake: DataProvider =
//     async (fetchType: string, resource: string, params: DataProviderParams) => {
//         return {
//             data: [
//                 { id: 1, name: "json" }
//             ]
//         }
//     }

// const fakeP = fake({ 'User': [{ id: 1, name: "json" }] })

// const usersProvider = forResource("UserW", fakeP)

// const prismaProvider: Promise<DataProvider> = buildOpenCrudProvider({
//     clientOptions: {
//         link, cache: new InMemoryCache()
//     }
// })

// const defaultProvider: Promise<DataProvider> = prismaProvider

// export const provider:DataProvider  = chain(usersProvider,prismaProvider)

export const provider: Promise<DataProvider> = (async () => {
  const m = (await model) as any;
  const dataSourcesDefinitions =
    m && m.dataSources
      ? m.dataSources.filter(
          (dataSource: any) => (dataSource.end ?? "back") === "back"
        )
      : undefined;
  if (dataSourcesDefinitions) {
    const dataProviders: Promise<DataProvider>[] = dataSourcesDefinitions.map(
      async (dataSourceD: any) => {
        const dataProvider = await resolve<DataProvider>(
          dataSourceD.dataProvider
        );
        return forResource(dataSourceD.resource, dataProvider);
      }
    );
    return Promise.all(dataProviders).then(dataPS => dataPS.reduce(chain));
  }
  return emptyDataProvider;
})();

// export const provider: Promise<DataProvider> = prismaProvider.then(p => chain(usersProvider, p))
