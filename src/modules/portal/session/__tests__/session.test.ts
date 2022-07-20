import { randomUUID } from "crypto";

import { getOperationError } from "src/__tests__/utils";
import { ChainId } from "src/config";
import Diagonal from "src/diagonal";
import { DiagonalError, ErrorType } from "src/error";
import { graphQLClient } from "src/graphql/__mocks__/client";
import { CreatePortalSessionMutation } from "src/graphql/schema.generated";

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

            graphQLClient.CreatePortalSession.mockResolvedValueOnce({
                data: {
                    createPortalSession: {
                        __typename: "CreatePortalSessionPayload",
                        portalSession: {
                            id,
                            url: portalUrl,
                        },
                    },
                },
                status: 200,
                headers: {} as any,
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

            graphQLClient.CreatePortalSession.mockResolvedValue({
                data: {
                    createPortalSession: {
                        __typename: "CreatePortalSessionPayload",
                        portalSession: {
                            id,
                            url: portalUrl,
                        },
                    },
                },
                status: 200,
                headers: {} as any,
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

        async function getCreatePortalSessionError(
            input: ICreatePortalSessionInput
        ): Promise<DiagonalError> {
            return getOperationError(async () => {
                const apiKey = "abc";
                const diagonal = new Diagonal(apiKey);
                await diagonal.portal.sessions.create(input);
            });
        }

        it.each([
            [
                "CreatePortalSessionCustomerNotFoundError",
                "Unable to find customer",
                ErrorType.InvalidRequest,
            ],
            [
                "CreatePortalSessionPackagesNotFoundError",
                "Unable to find package",
                ErrorType.InvalidRequest,
            ],
            [
                "CreatePortalSessionServiceNotInChainError",
                "Service is not deployed in specified chain",
                ErrorType.InvalidRequest,
            ],
            [
                "Error",
                "Unknown error occurred during checkout session creation",
                ErrorType.InternalService,
            ],
        ])(
            "Should throw CreatePortalSessionError if response __typename is %s",
            async (__typename, message, type) => {
                graphQLClient.CreatePortalSession.mockResolvedValueOnce({
                    data: {
                        createPortalSession: {
                            __typename,
                            message,
                        } as CreatePortalSessionMutation["createPortalSession"],
                    },
                    status: 200,
                    headers: {} as any,
                });
                const error = await getCreatePortalSessionError(input);
                expect(error.type).toBe(type);
                expect(error.message).toBe(message);
            }
        );

        function constructInvalidInput(invalidInput: {
            customerId?: string;
            returnUrl?: URL;
            configuration?: Record<string, unknown>;
        }) {
            return {
                customerId: invalidInput.customerId ?? input.customerId,
                returnUrl: invalidInput.returnUrl ?? input.returnUrl,
                configuration: invalidInput.configuration
                    ? {
                          ...input.configuration,
                          ...invalidInput.configuration,
                      }
                    : input.configuration,
            };
        }

        it.each([
            [
                "customerId",
                constructInvalidInput({
                    customerId: "",
                }),
                "String must contain at least 1 character(s) in `customerId` field.",
            ],
            [
                "non url value in returnUrl",
                constructInvalidInput({
                    returnUrl: "" as unknown as URL,
                }),
                "Input not instance of URL in `returnUrl` field.",
            ],
            [
                "non-existing chain in allowedChains",
                constructInvalidInput({
                    configuration: { availableChains: [0] },
                }),
                "received '0' in `configuration.availableChains.0` field",
            ],
            [
                "invalid value in availablePackages",
                constructInvalidInput({
                    configuration: { availablePackages: [undefined] },
                }),
                "Required in `configuration.availablePackages.0` field.",
            ],
            [
                "invalid packageId in availablePackages",
                constructInvalidInput({
                    configuration: {
                        availablePackages: [""],
                    },
                }),
                "Invalid uuid in `configuration.availablePackages.0` field.",
            ],
        ])(
            "Should throw with %s if supplied",
            async (_, invalidInput, message) => {
                const error = await getCreatePortalSessionError(
                    invalidInput as ICreatePortalSessionInput
                );
                expect(error.type).toBe(ErrorType.InvalidRequest);
                expect(error.message).toContain(message);
            }
        );
    });
});
