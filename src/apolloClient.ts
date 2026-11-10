import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const DEFAULT_GRAPHQL_ENDPOINT = 'https://graphql.morrisons.site/';

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT ?? DEFAULT_GRAPHQL_ENDPOINT;

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_ENDPOINT }),
  cache: new InMemoryCache(),
  // The unresolved-reports list can change behind the scenes (the
  // ad-reporter-investigate skill resolves reports on its own schedule), so a
  // cached/stale read would be actively misleading. Always hit the network.
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});
