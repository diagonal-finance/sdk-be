import { randomUUID } from "crypto";

import { getOperationError } from "src/__tests__/utils";
import { ChainId } from "src/config/chains";
import Diagonal from "src/diagonal";
import { DiagonalError, ErrorType } from "src/error";
import { graphQLClient } from "src/graphql/__mocks__/client";
import { CreateCheckoutSessionMutation } from "src/graphql/schema.generated";

import { ICreateCheckoutSessionInput } from "../types";

jest.mock("src/diagonal");

// Checkout session class tests
describe("CheckoutSessions", () => {
    describe("While creating", () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        it("Should be created successfully", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: randomUUID(),
                allowedChains: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: new URL("https://service.com/success"),
                optimisticRedirect: true,
            };

            const id = "123";
            const checkoutUrl = "checkout.diagonal.finance/" + id;

            graphQLClient.CreateCheckoutSession.mockImplementation(() => {
                return Promise.resolve({
                    createCheckoutSession: {
                        __typename: "CreateCheckoutSessionPayload",
                        checkoutSession: {
                            id,
                            url: checkoutUrl,
                        },
                    },
                });
            });

            const checkoutSessionResponse =
                await diagonal.checkout.sessions.create(checkoutSessionInput);

            expect(checkoutSessionResponse.id).toEqual(id);
            expect(checkoutSessionResponse.url).toEqual(checkoutUrl);

            expect(graphQLClient.CreateCheckoutSession).toBeCalledTimes(1);
        });

        async function getCreateCheckoutSessionError(
            input: ICreateCheckoutSessionInput
        ): Promise<DiagonalError> {
            return getOperationError(async () => {
                const apiKey = "abc";
                const diagonal = new Diagonal(apiKey);
                await diagonal.checkout.sessions.create(input);
            });
        }

        it.each([
            [
                "CreateCheckoutSessionPackageNotFoundError",
                "Unable to find package",
                ErrorType.InvalidRequest,
            ],
            [
                "CreateCheckoutSessionInvalidExpiresAtError",
                "ExpiresAt value is invalid",
                ErrorType.InvalidRequest,
            ],
            [
                "Error",
                "Unknown error occurred during the creation of a checkout session",
                ErrorType.InternalService,
            ],
        ])(
            "Should throw CreateCheckoutSessionError if response __typename is %s",
            async (__typename, message, type) => {
                const checkoutSessionInput: ICreateCheckoutSessionInput = {
                    packageId: randomUUID(),
                    allowedChains: [ChainId.Mumbai],
                    customerId: "12345",
                    cancelUrl: new URL("https://service.com/cancel"),
                    successUrl: new URL("https://service.com/success"),
                };

                graphQLClient.CreateCheckoutSession.mockImplementation(() => {
                    return Promise.resolve({
                        createCheckoutSession: {
                            __typename,
                            message,
                        } as CreateCheckoutSessionMutation["createCheckoutSession"],
                    });
                });

                const error = await getCreateCheckoutSessionError(
                    checkoutSessionInput
                );

                expect(error.type).toBe(type);
                expect(error.message).toBe(message);
            }
        );

        it("Should throw if invalid packageRegistryId is supplied", async () => {
            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: "",
                allowedChains: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: new URL("https://service.com/success"),
            };

            const error = await getCreateCheckoutSessionError(
                checkoutSessionInput
            );
            expect(error.type).toBe(ErrorType.InvalidRequest);
            expect(error.message).toBe(
                "Invalid payload. Invalid uuid in `packageId` field."
            );
        });

        it("Should throw if invalid chainId is supplied", async () => {
            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: randomUUID(),
                allowedChains: [123],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: new URL("https://service.com/success"),
            };

            const error = await getCreateCheckoutSessionError(
                checkoutSessionInput
            );
            expect(error.type).toBe(ErrorType.InvalidRequest);
            expect(error.message).toContain(
                "received '123' in `allowedChains.0` field."
            );
        });

        it("Should throw if invalid value in optimistic redirect is supplied", async () => {
            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: randomUUID(),
                allowedChains: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: new URL("https://service.com/success"),
                optimisticRedirect: "" as unknown as boolean,
            };

            const error = await getCreateCheckoutSessionError(
                checkoutSessionInput
            );
            expect(error.type).toBe(ErrorType.InvalidRequest);
            expect(error.message).toContain(
                "Expected boolean, received string in `optimisticRedirect` field."
            );
        });

        it("Should throw if invalid cancelUrl is supplied", async () => {
            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: randomUUID(),
                allowedChains: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: "" as unknown as URL,
                successUrl: new URL("https://service.com/success"),
            };

            const error = await getCreateCheckoutSessionError(
                checkoutSessionInput
            );
            expect(error.type).toBe(ErrorType.InvalidRequest);
            expect(error.message).toContain(
                "Input not instance of URL in `cancelUrl` field."
            );
        });

        it("Should throw if invalid successUrl is supplied", async () => {
            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: randomUUID(),
                allowedChains: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: "" as unknown as URL,
            };

            const error = await getCreateCheckoutSessionError(
                checkoutSessionInput
            );
            expect(error.type).toBe(ErrorType.InvalidRequest);
            expect(error.message).toContain(
                "Input not instance of URL in `successUrl` field."
            );
        });

        it("Should throw if expiresAt supplied is more than 24 hours from now", async () => {
            const dateTimeNow = new Date().getTime();
            const oneHourInMs = 3600 * 1000;
            const safeMarginInMs = 200;
            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: randomUUID(),
                allowedChains: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: new URL("https://service.com/success"),
                expiresAt: new Date(
                    dateTimeNow + 24 * oneHourInMs + safeMarginInMs
                ),
            };

            const error = await getCreateCheckoutSessionError(
                checkoutSessionInput
            );
            expect(error.type).toBe(ErrorType.InvalidRequest);
            expect(error.message).toContain(
                "Invalid input in `expiresAt` field."
            );
        });

        it("Should throw if expiresAt supplied is less than 1 hour from now", async () => {
            const dateTimeNow = new Date().getTime();
            const oneHourInMs = 3600 * 1000;
            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: randomUUID(),
                allowedChains: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: new URL("https://service.com/success"),
                expiresAt: new Date(dateTimeNow + oneHourInMs - 1),
            };

            const error = await getCreateCheckoutSessionError(
                checkoutSessionInput
            );
            expect(error.type).toBe(ErrorType.InvalidRequest);
            expect(error.message).toContain(
                "The date must be minimum 1 hour in `expiresAt` field."
            );
        });

        it("Should be created successfully if expiresAt supplied equal to 1 hour from now", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const dateTimeNow = Date.now();
            const oneHourInMs = 3600 * 1000;
            const safeMarginInMs = 200;
            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: randomUUID(),
                allowedChains: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: new URL("https://service.com/success"),
                expiresAt: new Date(dateTimeNow + oneHourInMs + safeMarginInMs),
            };

            graphQLClient.CreateCheckoutSession.mockImplementation(() => {
                return Promise.resolve({
                    createCheckoutSession: {
                        __typename: "CreateCheckoutSessionPayload",
                        checkoutSession: {
                            id: "123",
                            url: "checkoutUrl",
                        },
                    },
                });
            });

            await diagonal.checkout.sessions.create(checkoutSessionInput);
            expect(graphQLClient.CreateCheckoutSession).toBeCalledTimes(1);
        });

        it("Should be created successfully if expiresAt supplied equal to 24 hour from now", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const dateTimeNow = Date.now();
            const oneHourInMs = 3600 * 1000;
            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: randomUUID(),
                allowedChains: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: new URL("https://service.com/success"),
                expiresAt: new Date(dateTimeNow + oneHourInMs * 24),
            };

            graphQLClient.CreateCheckoutSession.mockImplementation(() => {
                return Promise.resolve({
                    createCheckoutSession: {
                        __typename: "CreateCheckoutSessionPayload",
                        checkoutSession: {
                            id: "123",
                            url: "checkoutUrl",
                        },
                    },
                });
            });

            await diagonal.checkout.sessions.create(checkoutSessionInput);
            expect(graphQLClient.CreateCheckoutSession).toBeCalledTimes(1);
        });
    });
});
