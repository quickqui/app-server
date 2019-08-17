import buildOpenCrudProvider from 'ra-data-opencrud';
import {env} from './Env'

import { InMemoryCache } from 'apollo-cache-inmemory';

import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import { ApolloCache } from 'apollo-cache';

const link = createHttpLink({ uri: env.dataUrl, fetch: fetch });

export const provrider =  buildOpenCrudProvider({clientOptions:{link,cache:new  InMemoryCache()}})
