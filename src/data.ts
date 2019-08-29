import buildOpenCrudProvider from 'ra-data-opencrud';
import { env } from './Env'

import { InMemoryCache } from 'apollo-cache-inmemory';

import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import { DataProvider, forResource, DataProviderParams, chain, fake } from '@quick-qui/data-provider';


const link = createHttpLink({ uri: env.dataUrl, fetch: fetch });

// const fake: DataProvider =
//     async (fetchType: string, resource: string, params: DataProviderParams) => {
//         return {
//             data: [
//                 { id: 1, name: "json" }
//             ]
//         }
//     }

const fakeP = fake({'User':[ { id: 1, name: "json" }]})

const usersProvider = forResource("User", fakeP)

const prismaProvider: Promise<DataProvider> = buildOpenCrudProvider({
    clientOptions: {
        link, cache: new InMemoryCache()
    }
})

// export const provider:DataProvider  = chain(usersProvider,prismaProvider)
export const provider: Promise<DataProvider> = prismaProvider.then(p => chain(usersProvider, p))




