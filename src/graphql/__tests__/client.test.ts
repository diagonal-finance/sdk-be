import { ClientError, GraphQLClient } from "graphql-request";

import { getGraphQLClient } from "../client";
import { AuthenticationError } from "../errors";

jest.mock("graphql-request", () => ({
    ...jest.requireActual("graphql-request"),
    GraphQLClient: jest.fn(),
}));

describe("When getting the graphql client", () => {
    const graphqlClient = jest.mocked(GraphQLClient, true);
    const defaultUrl = "https://api.diagonal.finance/graphql";

    test("Sets the API key in headers", () => {
        const apiKey = "API-KEY";
        getGraphQLClient("API-KEY");
        expect(graphqlClient).toHaveBeenCalledWith(defaultUrl, {
            headers: {
                "x-api-key": apiKey,
            },
        });
    });
    test("Fails if API key not provided", () => {
        const getGraphQLClientFn = () =>
            getGraphQLClient(undefined as unknown as string);
        expect(getGraphQLClientFn).toThrowError(AuthenticationError);
    });
    test("Fallsback to default URL if not provided", () => {
        getGraphQLClient("API-KEY");
        expect(graphqlClient).toHaveBeenCalledWith(
            defaultUrl,
            expect.any(Object)
        );
    });
    test("Uses URL if provided", () => {
        const customUrl = "http://example.com";
        getGraphQLClient("API-KEY", customUrl);
        expect(graphqlClient).toHaveBeenCalledWith(
            customUrl,
            expect.any(Object)
        );
    });
});

describe("When using the graphql client", () => {
    function setup() {
        const graphqlClient = jest.mocked(GraphQLClient, true);
        const request = jest.fn();
        graphqlClient.mockReturnValue({
            request,
        } as unknown as GraphQLClient);
        const client = getGraphQLClient("API_KEY");
        return {
            client,
            request: request,
        };
    }

    test("Throws AuthenticationError if UNAUTHORIZED is received", async () => {
        const { request, client } = setup();

        request.mockImplementation(() => {
            throw new ClientError(
                {
                    errors: [
                        {
                            extensions: {
                                code: "UNAUTHORIZED",
                            },
                            message: "Error message",
                        },
                    ],
                    status: 200,
                },
                { query: "" }
            );
        });

        const getGraphQLClientFn = async () =>
            client.CheckoutSessionCreate({
                input: {
                    cancelUrl: "",
                    customerId: "",
                    packageId: "",
                    successUrl: "",
                },
            });
        await expect(getGraphQLClientFn).rejects.toThrow(AuthenticationError);
    });
});
