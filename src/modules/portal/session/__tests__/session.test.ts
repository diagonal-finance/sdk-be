import { randomUUID } from "crypto";

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
                availableChains: [ChainId.ArbitrumRinkeby],
                availablePackages: [randomUUID()],
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
                        __typename: "CreatePortalSessionPayload",
                        portalSession: {
                            id,
                            url: portalUrl,
                        },
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
                        __typename: "CreatePortalSessionPayload",
                        portalSession: {
                            id,
                            url: portalUrl,
                        },
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
            [
                "CreatePortalSessionCustomerNotFoundError",
                "Unable to find customer",
            ],
            [
                "CreatePortalSessionPackagesNotFoundError",
                "Unable to find package",
            ],
            [
                "CreatePortalSessionServiceNotInChainError",
                "Service is not deployed in specified chain",
            ],
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
                "invalid value in availablePackagesById",
                constructInvalidInput({
                    configuration: { availablePackagesById: [undefined] },
                }),
            ],
            [
                "empty availablePackagesById",
                constructInvalidInput({
                    configuration: { availablePackagesById: [] },
                }),
            ],
            [
                "invalid packageId in availablePackagesById",
                constructInvalidInput({
                    configuration: {
                        availablePackagesById: [""],
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
