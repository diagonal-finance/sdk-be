import { ClientError, GraphQLClient } from "graphql-request";
import { getOperationError } from "src/__tests__/utils";
import { DiagonalError, ErrorType } from "src/error";

import pkg from "../../../package.json";
import { getGraphQLClient } from "../client";

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
                "x-sdk-version": `${pkg.name}@${pkg.version}`,
                "x-sdk-platform": "node",
                "x-sdk-platform-version": process.versions.node,
                "user-agent": `${pkg.name}@${pkg.version} (Node ${process.versions.node})`,
            },
        });
    });
    test("Fails if API key not provided", async () => {
        const error = await getOperationError(() =>
            getGraphQLClient(undefined as unknown as string)
        );
        expect(error.type).toBe(ErrorType.Authentication);
        expect(error.message).toBe("API key not provided");
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
        return {
            request: request,
        };
    }

    afterEach(() => {
        jest.resetAllMocks();
    });

    async function getExecuteQueryError(): Promise<DiagonalError> {
        return getOperationError(async () => {
            const client = getGraphQLClient("API_KEY");
            await client.CreateCheckoutSession({
                input: {
                    cancelUrl: "",
                    customerId: "",
                    packageId: "",
                    successUrl: "",
                },
            });
        });
    }

    test("Throws AuthenticationError if UNAUTHORIZED is received", async () => {
        const { request } = setup();

        request.mockImplementation(() => {
            throw new ClientError(
                {
                    errors: [
                        {
                            extensions: {
                                code: "UNAUTHORIZED",
                            },
                            message: "Unauthorized message",
                        },
                    ],
                    status: 200,
                },
                { query: "" }
            );
        });

        const error = await getExecuteQueryError();
        expect(error.type).toBe(ErrorType.Authentication);
        expect(error.message).toBe(
            "Unable to authenticate with API key provided"
        );
    });

    test("Throws PermissionError if PERMISSION is received", async () => {
        const { request } = setup();

        request.mockImplementation(() => {
            throw new ClientError(
                {
                    errors: [
                        {
                            extensions: {
                                code: "PERMISSION",
                            },
                            message:
                                "The API key used for this request does not have the necessary permissions.",
                        },
                    ],
                    status: 200,
                },
                { query: "" }
            );
        });

        const error = await getExecuteQueryError();
        expect(error.type).toBe(ErrorType.Permission);
        expect(error.message).toBe(
            "The API key used for this request does not have the necessary permissions."
        );
    });

    test("Throws InvalidInputError if BAD_USER_INPUT is received", async () => {
        const { request } = setup();

        request.mockImplementation(() => {
            throw new ClientError(
                {
                    errors: [
                        {
                            extensions: {
                                code: "BAD_USER_INPUT",
                            },
                            message: "Bad user input message",
                        },
                    ],
                    status: 200,
                },
                { query: "" }
            );
        });

        const error = await getExecuteQueryError();
        expect(error.type).toBe(ErrorType.InvalidRequest);
        expect(error.message).toContain("Invalid input value provided");
    });
});
