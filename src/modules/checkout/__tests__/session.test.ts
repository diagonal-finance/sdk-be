import {
    Diagonal,
    ICheckoutSessionInput,
    ICheckoutSessionResponse,
} from "../../..";
import { ChainId } from "../../../config/chains";
import { graphQLClient } from "../../../graphql/__mocks__/client";
import { InvalidCheckoutSessionInputError } from "../errors";

jest.mock("../../../diagonal");

// Checkout session class tests
describe("CheckoutSession", () => {
    describe("While creating", () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        it("Should be created successfully", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICheckoutSessionInput = {
                packageId: 1,
                chainIds: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: "https://service.com/cancel",
                successUrl: "https://service.com/success",
            };

            const id = "123";
            const checkoutUrl = "checkout.diagonal.finance/" + id;

            graphQLClient.CheckoutSessionCreate.mockImplementation(() => {
                return Promise.resolve({
                    checkoutSessionCreate: {
                        id,
                        url: checkoutUrl,
                    },
                });
            });

            const checkoutSessionResponse: ICheckoutSessionResponse =
                await diagonal.checkoutSession.create(checkoutSessionInput);

            expect(checkoutSessionResponse.id).toEqual(id);
            expect(checkoutSessionResponse.url).toEqual(checkoutUrl);

            expect(graphQLClient.CheckoutSessionCreate).toBeCalledTimes(1);
            // expect(fetchMock).toBeCalledWith()
        });

        it("InvalidCheckoutSessionInputError should be thrown if invalid packageRegistryId is supplied", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICheckoutSessionInput = {
                packageId: 0,
                chainIds: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: "https://service.com/cancel",
                successUrl: "https://service.com/success",
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkoutSession.create(checkoutSessionInput);

            expect(createCheckoutSessionFn).rejects.toBeInstanceOf(
                InvalidCheckoutSessionInputError
            );
        });

        it("InvalidCheckoutSessionInputError should be thrown if invalid chainId is supplied", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICheckoutSessionInput = {
                packageId: 1,
                chainIds: [123],
                customerId: "12345",
                cancelUrl: "https://service.com/cancel",
                successUrl: "https://service.com/success",
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkoutSession.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toBeInstanceOf(
                InvalidCheckoutSessionInputError
            );
        });

        it("InvalidCheckoutSessionInputError should be thrown if invalid cancelUrl is supplied", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICheckoutSessionInput = {
                packageId: 1,
                chainIds: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: "service.com/cancel",
                successUrl: "https://service.com/success",
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkoutSession.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toBeInstanceOf(
                InvalidCheckoutSessionInputError
            );
        });

        it("InvalidCheckoutSessionInputError should be thrown if invalid successUrl is supplied", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICheckoutSessionInput = {
                packageId: 1,
                chainIds: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: "https://service.com/cancel",
                successUrl: "service.com/success",
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkoutSession.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toBeInstanceOf(
                InvalidCheckoutSessionInputError
            );
        });

        it("InvalidCheckoutSessionInputError should be thrown if invalid expiresAt date is supplied", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const dateTimeNow = new Date().getTime();
            let expiresAt = new Date(dateTimeNow - 1000);

            const checkoutSessionInput: ICheckoutSessionInput = {
                packageId: 1,
                chainIds: [ChainId.Mumbai],
                customerId: "12345",
                cancelUrl: "https://service.com/cancel",
                successUrl: "https://service.com/success",
                expiresAt: expiresAt,
            };

            const createCheckoutSessionFn1 = async () =>
                diagonal.checkoutSession.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn1).rejects.toBeInstanceOf(
                InvalidCheckoutSessionInputError
            );

            expiresAt = new Date(dateTimeNow + 25 * 60 * 60 * 1000);
            const checkoutSessionInput2 = {
                ...checkoutSessionInput,
                expiresAt: expiresAt,
            };

            const createCheckoutSessionFn2 = async () =>
                diagonal.checkoutSession.create(checkoutSessionInput2);

            await expect(createCheckoutSessionFn2).rejects.toBeInstanceOf(
                InvalidCheckoutSessionInputError
            );
        });
    });
});
