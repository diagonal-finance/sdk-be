import { CreateCheckoutSessionMutation } from "src/graphql/schema.generated";

import { Diagonal } from "../../../..";
import { ChainId } from "../../../../config/chains";
import { graphQLClient } from "../../../../graphql/__mocks__/client";
import {
    CreateCheckoutSessionError,
    InvalidCheckoutSessionInputError,
} from "../errors";
import { ICreateCheckoutSessionInput } from "../types";

jest.mock("../../../../diagonal");

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
                packageId: 1,
                chainIds: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: new URL("https://service.com/success"),
            };

            const id = "123";
            const checkoutUrl = "checkout.diagonal.finance/" + id;

            graphQLClient.CreateCheckoutSession.mockImplementation(() => {
                return Promise.resolve({
                    createCheckoutSession: {
                        __typename: "CheckoutSession",
                        id,
                        url: checkoutUrl,
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
            ["PackageNotFound", "Unable to find package"],
            ["InvalidExpiresAt", "ExpiresAt value is invalid"],
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
                    packageId: 1,
                    chainIds: [ChainId.Mumbai],
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
                    new CreateCheckoutSessionError(message)
                );
            }
        );

        it("Should throw if invalid packageRegistryId is supplied", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: 0,
                chainIds: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: new URL("https://service.com/success"),
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkout.sessions.create(checkoutSessionInput);

            expect(createCheckoutSessionFn).rejects.toThrow(
                InvalidCheckoutSessionInputError
            );
        });

        it("Should throw if invalid chainId is supplied", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: 1,
                chainIds: [123],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: new URL("https://service.com/success"),
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkout.sessions.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                InvalidCheckoutSessionInputError
            );
        });

        it("Should throw if invalid cancelUrl is supplied", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: 1,
                chainIds: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: "" as unknown as URL,
                successUrl: new URL("https://service.com/success"),
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkout.sessions.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                InvalidCheckoutSessionInputError
            );
        });

        it("Should throw if invalid successUrl is supplied", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: 1,
                chainIds: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: "" as unknown as URL,
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkout.sessions.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                InvalidCheckoutSessionInputError
            );
        });

        it("Should throw if expiresAt supplied is more than 24 hours from now", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const dateTimeNow = new Date().getTime();
            const oneHourInMs = 3600 * 1000;
            const safeMarginInMs = 200;
            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: 1,
                chainIds: [ChainId.Mumbai],
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
                InvalidCheckoutSessionInputError
            );
        });

        it("Should throw if expiresAt supplied is less than 1 hour from now", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const dateTimeNow = new Date().getTime();
            const oneHourInMs = 3600 * 1000;
            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: 1,
                chainIds: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: new URL("https://service.com/success"),
                expiresAt: new Date(dateTimeNow + oneHourInMs - 1),
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkout.sessions.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                InvalidCheckoutSessionInputError
            );
        });

        it("Should be created successfully if expiresAt supplied equal to 1 hour from now", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const dateTimeNow = Date.now();
            const oneHourInMs = 3600 * 1000;
            const safeMarginInMs = 200;
            const checkoutSessionInput: ICreateCheckoutSessionInput = {
                packageId: 1,
                chainIds: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: new URL("https://service.com/success"),
                expiresAt: new Date(dateTimeNow + oneHourInMs + safeMarginInMs),
            };

            graphQLClient.CreateCheckoutSession.mockImplementation(() => {
                return Promise.resolve({
                    createCheckoutSession: {
                        __typename: "CheckoutSession",
                        id: "123",
                        url: "checkoutUrl",
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
                packageId: 1,
                chainIds: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: new URL("https://service.com/cancel"),
                successUrl: new URL("https://service.com/success"),
                expiresAt: new Date(dateTimeNow + oneHourInMs * 24),
            };

            graphQLClient.CreateCheckoutSession.mockImplementation(() => {
                return Promise.resolve({
                    createCheckoutSession: {
                        __typename: "CheckoutSession",
                        id: "123",
                        url: "checkoutUrl",
                    },
                });
            });

            await diagonal.checkout.sessions.create(checkoutSessionInput);
            expect(graphQLClient.CreateCheckoutSession).toBeCalledTimes(1);
        });
    });
});
