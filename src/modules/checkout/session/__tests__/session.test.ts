import { randomUUID } from "crypto";

import { ChainId } from "src/config/chains";
import Diagonal from "src/diagonal";
import { graphQLClient } from "src/graphql/__mocks__/client";
import { CreateCheckoutSessionMutation } from "src/graphql/schema.generated";

import { CreateCheckoutSessionInputError } from "../errors";
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

        it.each([
            [
                "CreateCheckoutSessionPackageNotFoundError",
                "Unable to find package",
            ],
            [
                "CreateCheckoutSessionInvalidExpiresAtError",
                "ExpiresAt value is invalid",
            ],
            [
                "Error",
                "Unknown error occurred during checkout session creation",
            ],
        ])(
            "Should throw CreateCheckoutSessionError if response __typename is %s",
            async (__typename, message) => {
                const apiKey = "abc";
                const diagonal = new Diagonal(apiKey);

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

                const createCheckoutSessionFn = async () =>
                    diagonal.checkout.sessions.create(checkoutSessionInput);

                await expect(createCheckoutSessionFn).rejects.toThrow(
                    new CreateCheckoutSessionInputError(message)
                );
            }
        );

        it("Should throw if invalid packageRegistryId is supplied", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: "",
                allowedChains: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: new URL("https://service.com/success"),
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkout.sessions.create(checkoutSessionInput);

            expect(createCheckoutSessionFn).rejects.toThrow(
                CreateCheckoutSessionInputError
            );
        });

        it("Should throw if invalid chainId is supplied", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: randomUUID(),
                allowedChains: [123],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: new URL("https://service.com/success"),
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkout.sessions.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                CreateCheckoutSessionInputError
            );
        });

        it("Should throw if invalid cancelUrl is supplied", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: randomUUID(),
                allowedChains: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: "" as unknown as URL,
                successUrl: new URL("https://service.com/success"),
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkout.sessions.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                CreateCheckoutSessionInputError
            );
        });

        it("Should throw if invalid successUrl is supplied", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: randomUUID(),
                allowedChains: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: "" as unknown as URL,
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkout.sessions.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                CreateCheckoutSessionInputError
            );
        });

        it("Should throw if expiresAt supplied is more than 24 hours from now", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

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

            const createCheckoutSessionFn = async () =>
                diagonal.checkout.sessions.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                CreateCheckoutSessionInputError
            );
        });

        it("Should throw if expiresAt supplied is less than 1 hour from now", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

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

            const createCheckoutSessionFn = async () =>
                diagonal.checkout.sessions.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                CreateCheckoutSessionInputError
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
