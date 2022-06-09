import {
    Diagonal,
    ICheckoutSessionInput,
    ICheckoutSessionResponse,
} from "../src";
import fetch from "cross-fetch";
import {
    ApiKeyNotProvidedError,
    CheckoutSessionApiError,
    InvalidCheckoutSessionInputError,
    UnauthorizedError,
} from "../src/error";
import { config } from "../src/config";

jest.mock("cross-fetch", () => {
    //Mock the default export
    return {
        __esModule: true,
        default: jest.fn(),
    };
});

// Checkout session class tests
describe("CheckoutSession tests", () => {
    const fetchMock = jest.mocked(fetch, true);

    describe("create tests", () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        it("Checkout session should be created successfully", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICheckoutSessionInput = {
                serviceAddress: "0x2d3873af2d3f1a24caf1d684c1bcb9b4a945d63f",
                packageRegistryId: 1,
                chainId: 80001,
                externalCustomerId: "12345",
                cancelUrl: "https://service.com/cancel",
                successUrl: "https://service.com/success",
            };

            fetchMock.mockResolvedValue({
                status: 200,
                json: () => {
                    return {
                        data: {
                            checkoutSessionCreate: {
                                uuid: "abc",
                                cancelUrl: checkoutSessionInput.cancelUrl,
                                successUrl: checkoutSessionInput.successUrl,
                            },
                        },
                    };
                },
            } as any);

            const checkoutSessionResponse: ICheckoutSessionResponse =
                await diagonal.checkoutSession.create(checkoutSessionInput);
            expect(checkoutSessionResponse.uuid).toEqual(expect.any(String));
            expect(checkoutSessionResponse.cancelUrl).toEqual(
                checkoutSessionInput.cancelUrl
            );
            expect(checkoutSessionResponse.successUrl).toEqual(
                checkoutSessionInput.successUrl
            );

            expect(checkoutSessionResponse.url).toEqual(config.checkoutUrl);

            expect(fetchMock).toBeCalledTimes(1);
            // expect(fetchMock).toBeCalledWith()
        });

        it("UnauthorizedError should be thrown is the request is unauthorized", async () => {
            const apiKey = "cde";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICheckoutSessionInput = {
                serviceAddress: "0x2d3873af2d3f1a24caf1d684c1bcb9b4a945d63f",
                packageRegistryId: 1,
                chainId: 80001,
                externalCustomerId: "12345",
                cancelUrl: "https://service.com/cancel",
                successUrl: "https://service.com/success",
            };

            fetchMock.mockResolvedValue({
                status: 200,
                json: () => {
                    return {
                        data: {},
                        errors: [{ extensions: { code: "UNAUTHORIZED" } }],
                    };
                },
            } as any);

            const createCheckoutSessionFn = async () =>
                diagonal.checkoutSession.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                UnauthorizedError
            );
            expect(fetchMock).toBeCalledTimes(1);
            await expect(createCheckoutSessionFn).rejects.toThrow(
                "Unathorized request to create checkout session."
            );
            expect(fetchMock).toBeCalledTimes(2);
        });

        it("CheckoutSessionApiError should be thrown is API error is thrown", async () => {
            const apiKey = "cde";
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICheckoutSessionInput = {
                serviceAddress: "0x2d3873af2d3f1a24caf1d684c1bcb9b4a945d63f",
                packageRegistryId: 1,
                chainId: 80001,
                externalCustomerId: "12345",
                cancelUrl: "https://service.com/cancel",
                successUrl: "https://service.com/success",
            };

            fetchMock.mockResolvedValue({
                status: 200,
                json: () => {
                    return {
                        data: {},
                        errors: [{ extensions: { code: "SERVICE_NOT_FOUND" } }],
                    };
                },
            } as any);

            const createCheckoutSessionFn = async () =>
                diagonal.checkoutSession.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                CheckoutSessionApiError
            );
            expect(fetchMock).toBeCalledTimes(1);
            await expect(createCheckoutSessionFn).rejects.toThrow(
                "API error while creating checkout session: SERVICE_NOT_FOUND"
            );
            expect(fetchMock).toBeCalledTimes(2);
        });

        it("InvalidCheckoutSessionInputError should be thrown if invalid serviceAddress is supplied to the checkoutSessionInput", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            let checkoutSessionInput: ICheckoutSessionInput = {
                serviceAddress: "",
                packageRegistryId: 1,
                chainId: 80001,
                externalCustomerId: "12345",
                cancelUrl: "https://service.com/cancel",
                successUrl: "https://service.com/success",
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkoutSession.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                InvalidCheckoutSessionInputError
            );
            await expect(createCheckoutSessionFn).rejects.toThrow(
                "Invalid checkout session input `serviceAddress` field."
            );
        });

        it("InvalidCheckoutSessionInputError should be thrown if invalid packageRegistryId is supplied to the checkoutSessionInput", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            let checkoutSessionInput: ICheckoutSessionInput = {
                serviceAddress: "0x2d3873af2d3f1a24caf1d684c1bcb9b4a945d63f",
                packageRegistryId: 0,
                chainId: 80001,
                externalCustomerId: "12345",
                cancelUrl: "https://service.com/cancel",
                successUrl: "https://service.com/success",
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkoutSession.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                InvalidCheckoutSessionInputError
            );
            await expect(createCheckoutSessionFn).rejects.toThrow(
                "Invalid checkout session input `packageRegistryId` field."
            );
        });

        it("InvalidCheckoutSessionInputError should be thrown if invalid chainId is supplied to the checkoutSessionInput", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            let checkoutSessionInput: ICheckoutSessionInput = {
                serviceAddress: "0x2d3873af2d3f1a24caf1d684c1bcb9b4a945d63f",
                packageRegistryId: 1,
                chainId: 123,
                externalCustomerId: "12345",
                cancelUrl: "https://service.com/cancel",
                successUrl: "https://service.com/success",
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkoutSession.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                InvalidCheckoutSessionInputError
            );
            await expect(createCheckoutSessionFn).rejects.toThrow(
                "Invalid checkout session input `chainId` field."
            );
        });

        it("InvalidCheckoutSessionInputError should be thrown if invalid cancelUrl is supplied to the checkoutSessionInput", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            let checkoutSessionInput: ICheckoutSessionInput = {
                serviceAddress: "0x2d3873af2d3f1a24caf1d684c1bcb9b4a945d63f",
                packageRegistryId: 1,
                chainId: 80001,
                externalCustomerId: "12345",
                cancelUrl: "service.com/cancel",
                successUrl: "https://service.com/success",
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkoutSession.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                InvalidCheckoutSessionInputError
            );
            await expect(createCheckoutSessionFn).rejects.toThrow(
                "Invalid checkout session input `cancelUrl` field."
            );
        });

        it("InvalidCheckoutSessionInputError should be thrown if invalid successUrl is supplied to the checkoutSessionInput", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            let checkoutSessionInput: ICheckoutSessionInput = {
                serviceAddress: "0x2d3873af2d3f1a24caf1d684c1bcb9b4a945d63f",
                packageRegistryId: 1,
                chainId: 80001,
                externalCustomerId: "12345",
                cancelUrl: "https://service.com/cancel",
                successUrl: "service.com/success",
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkoutSession.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                InvalidCheckoutSessionInputError
            );
            await expect(createCheckoutSessionFn).rejects.toThrow(
                "Invalid checkout session input `successUrl` field."
            );
        });

        it("InvalidCheckoutSessionInputError should be thrown if invalid expiresAt date is supplied to the checkoutSessionInput", async () => {
            const apiKey = "abc";
            const diagonal = new Diagonal(apiKey);

            let dateTimeNow = new Date().getTime();
            let expiresAt = new Date(dateTimeNow - 1000);

            let checkoutSessionInput: ICheckoutSessionInput = {
                serviceAddress: "0x2d3873af2d3f1a24caf1d684c1bcb9b4a945d63f",
                packageRegistryId: 1,
                chainId: 80001,
                externalCustomerId: "12345",
                cancelUrl: "https://service.com/cancel",
                successUrl: "https://service.com/success",
                expiresAt: expiresAt,
            };

            const createCheckoutSessionFn1 = async () =>
                diagonal.checkoutSession.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn1).rejects.toThrow(
                InvalidCheckoutSessionInputError
            );
            await expect(createCheckoutSessionFn1).rejects.toThrow(
                "Invalid checkout session input `expiresAt` field."
            );

            expiresAt = new Date(dateTimeNow + 25 * 60 * 60 * 1000);
            let checkoutSessionInput2 = {
                ...checkoutSessionInput,
                expiresAt: expiresAt,
            };

            const createCheckoutSessionFn2 = async () =>
                diagonal.checkoutSession.create(checkoutSessionInput2);

            await expect(createCheckoutSessionFn2).rejects.toThrow(
                InvalidCheckoutSessionInputError
            );
            await expect(createCheckoutSessionFn2).rejects.toThrow(
                "Invalid checkout session input `expiresAt` field."
            );
        });

        it("ApiKeyNotProvidedError should be thrown if API key is not provided", async () => {
            config.apiKey = "";
            let diagonal = new Diagonal();

            let checkoutSessionInput: ICheckoutSessionInput = {
                serviceAddress: "0x2d3873af2d3f1a24caf1d684c1bcb9b4a945d63f",
                packageRegistryId: 1,
                chainId: 80001,
                externalCustomerId: "12345",
                cancelUrl: "https://service.com/cancel",
                successUrl: "https://service.com/success",
            };

            const createCheckoutSessionFn = async () =>
                diagonal.checkoutSession.create(checkoutSessionInput);

            await expect(createCheckoutSessionFn).rejects.toThrow(
                ApiKeyNotProvidedError
            );
            await expect(createCheckoutSessionFn).rejects.toThrow(
                "API key not provided"
            );
        });
    });
});
