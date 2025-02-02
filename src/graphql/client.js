import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GraphQLAPI, SupportedNetworks } from '../config/constants';

export const ethClient = new ApolloClient({
  uri: GraphQLAPI[SupportedNetworks.ethereum.chainID],
  cache: new InMemoryCache(),
});

export const opClient = new ApolloClient({
  uri: GraphQLAPI[SupportedNetworks.optimism.chainID],
  cache: new InMemoryCache(),
});

export const maticClient = new ApolloClient({
  uri: GraphQLAPI[SupportedNetworks.matic.chainID],
  cache: new InMemoryCache(),
});

export const graphQLClient = chainId => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    uri: GraphQLAPI[chainId],
  });
};
