import { GraphQLClient as GraphQLClientRequest } from "graphql-request";

import { getSdk, Sdk } from "../schema.generated";

export type GraphQLClient = Sdk;

jest.mock("graphql-request");

export const graphQLClient = getSdk(
    new GraphQLClientRequest("url")
) as jest.MockedObjectDeep<GraphQLClient>;
for (const operation in graphQLClient) {
    Reflect.set(graphQLClient, operation, jest.fn());
}

export const getGraphQLClient = (): jest.MockedObjectDeep<GraphQLClient> => {
    return graphQLClient;
};
