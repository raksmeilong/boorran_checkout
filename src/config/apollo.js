import { createClient } from "graphql-ws";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

import { HASURA_URL, HASURA_KEY, HASURA_WSS } from "../redux/config";

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-hasura-admin-secret": HASURA_KEY,
    },
  };
});

const wsLink = new GraphQLWsLink(
  createClient({
    uri: HASURA_WSS,
    options: {
      reconnect: true,
      connectionParams: {
        headers: {
          "x-hasura-admin-secret": HASURA_KEY,
        },
      },
    },
  })
);

const httpLink = createHttpLink({ uri: HASURA_URL });

const client = new ApolloClient({
  link: authLink.concat(httpLink, wsLink),
  cache: new InMemoryCache(),
  //   {
  //   typePolicies: {
  //     Query: {
  //       fields: {
  //         products: relayStylePagination(),
  //       },
  //     },
  //   },
  // }
});

export default client;
