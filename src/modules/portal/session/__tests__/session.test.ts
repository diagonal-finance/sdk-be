import { ChainId } from "src/config";
import Diagonal from "src/diagonal";
import { graphQLClient } from "src/graphql/__mocks__/client";
import { CreatePortalSessionMutation } from "src/graphql/schema.generated";

import { CreatePortalSessionInputError } from "../errors";
import { ICreatePortalSessionInput } from "../types";

jest.mock("src/diagonal");

// Checkout session class tests
describe("PortalSession", () => {
    describe("While creating", () => {
        const input: ICreatePortalSessionInput = {
            customerId: "123",
            returnUrl: new URL("https://return.url"),
            configuration: {
                allowedChains: [ChainId.ArbitrumRinkeby],
                availablePackages: [
                    { packageId: "1", chainId: ChainId.ArbitrumRinkeby },
                ],
            },
        };

        afterEach(() => {
            jest.resetAllMocks();
        });

        it("Should be created successfully", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const id = "123";
            const portalUrl = "subscription.diagonal.finance/" + id;

            graphQLClient.CreatePortalSession.mockImplementation(() => {
                return Promise.resolve({
                    createPortalSession: {
                        __typename: "PortalSession",
                        id,
                        url: portalUrl,
                    },
                });
            });

            const checkoutSessionResponse =
                await diagonal.portal.sessions.create(input);

            expect(checkoutSessionResponse.id).toEqual(id);
            expect(checkoutSessionResponse.url).toEqual(portalUrl);

            expect(graphQLClient.CreatePortalSession).toBeCalledTimes(1);
        });

        it("Should be created successfully without any configuration", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const id = "123";
            const portalUrl = "subscription.diagonal.finance/" + id;

            graphQLClient.CreatePortalSession.mockImplementation(() => {
                return Promise.resolve({
                    createPortalSession: {
                        __typename: "PortalSession",
                        id,
                        url: portalUrl,
                    },
                });
            });

            const checkoutSessionResponse =
                await diagonal.portal.sessions.create({
                    customerId: input.customerId,
                    returnUrl: input.returnUrl,
                });

            expect(checkoutSessionResponse.id).toEqual(id);
            expect(checkoutSessionResponse.url).toEqual(portalUrl);

            expect(graphQLClient.CreatePortalSession).toBeCalledTimes(1);
        });

        it.each([
            ["NoCustomerFoundError", "Unable to find package"],
            [
                "Error",
                "Unknown error occurred during checkout session creation",
            ],
        ])(
            "Should throw CreatePortalSessionError if response __typename is %s",
            async (__typename, message) => {
                const apiKey = "abc";
                const diagonal = new Diagonal(apiKey);

                graphQLClient.CreatePortalSession.mockImplementation(() => {
                    return Promise.resolve({
                        createPortalSession: {
                            __typename,
                            message,
                        } as CreatePortalSessionMutation["createPortalSession"],
                    });
                });

                const createCheckoutSessionFn = async () =>
                    diagonal.portal.sessions.create(input);

                await expect(createCheckoutSessionFn).rejects.toThrow(
                    new CreatePortalSessionInputError(message)
                );
            }
        );

        function constructInvalidInput(invalidInput: {
            customerId?: string;
            configuration: Record<string, unknown>;
        }) {
            return {
                customerId: invalidInput.customerId ?? input.customerId,
                configuration: invalidInput.configuration
                    ? {
                          ...input.configuration,
                          ...invalidInput.configuration,
                      }
                    : input.configuration,
            };
        }

        it.each([
            ["customerId", { ...input, customerId: "" }],
            [
                "non url value in returnUrl",
                constructInvalidInput({
                    configuration: { returnUrl: undefined },
                }),
            ],
            [
                "non-existing chain in allowedChains",
                constructInvalidInput({
                    configuration: { allowedChains: [0] },
                }),
            ],
            [
                "invalid value in availablePackages",
                constructInvalidInput({
                    configuration: { availablePackages: [undefined] },
                }),
            ],
            [
                "empty availablePackages",
                constructInvalidInput({
                    configuration: { availablePackages: [] },
                }),
            ],
            [
                "invalid packageId in availablePackages",
                constructInvalidInput({
                    configuration: {
                        availablePackages: [
                            { packageId: "", chainId: ChainId.Polygon },
                        ],
                    },
                }),
            ],
            [
                "invalid packageId in availablePackages",
                constructInvalidInput({
                    configuration: {
                        availablePackages: [{ packageId: "123", chainId: 0 }],
                    },
                }),
            ],
        ])("Should throw if %s is supplied", async (_, invalidInput) => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const createCheckoutSessionFn = async () =>
                diagonal.portal.sessions.create(
                    invalidInput as ICreatePortalSessionInput
                );

            expect(createCheckoutSessionFn).rejects.toThrow(
                CreatePortalSessionInputError
            );
        });
    });
});
