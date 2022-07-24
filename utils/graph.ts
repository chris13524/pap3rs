import { ApolloClient, InMemoryCache } from '@apollo/client'

const APIURL = "https://api.thegraph.com/subgraphs/name/chris13524/pap3rs";

export const graphClient = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
});
