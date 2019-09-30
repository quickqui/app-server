import buildOpenCrudProvider from 'ra-data-opencrud';
import { env } from './Env'

import { InMemoryCache } from 'apollo-cache-inmemory';

import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import { DataProvider, forResource, chain, fake } from '@quick-qui/data-provider';
import * as _ from 'lodash';


import { model } from './Model'


const link = createHttpLink({ uri: env.dataUrl, fetch: fetch });

// const fake: DataProvider =
//     async (fetchType: string, resource: string, params: DataProviderParams) => {
//         return {
//             data: [
//                 { id: 1, name: "json" }
//             ]
//         }
//     }

const fakeP = fake({ 'User': [{ id: 1, name: "json" }] })

const usersProvider = forResource("UserW", fakeP)

// const prismaProvider: Promise<DataProvider> = buildOpenCrudProvider({
//     clientOptions: {
//         link, cache: new InMemoryCache()
//     }
// })

// const defaultProvider: Promise<DataProvider> = prismaProvider

// export const provider:DataProvider  = chain(usersProvider,prismaProvider)

const providers = async () => {
    const m = (await model) as any
    console.dir(m)
    if (m.datasources) {
        return m.datasources.map(datasource => {
            //TODO 适应更多的module path模式。
            const path = env.extendPath+"/dist/src"+datasource.dataprovider
            console.debug(path)
            const provider = require(path)
            console.info(`provider loaded - ${provider}`)
            return forResource(datasource.resource, provider)
        })
    }
    return []
}


export const provider: Promise<DataProvider> = providers().then( pros =>
    _.reduceRight(pros, (a, b) => chain(b, a), usersProvider)
)


// export const provider: Promise<DataProvider> = prismaProvider.then(p => chain(usersProvider, p))




