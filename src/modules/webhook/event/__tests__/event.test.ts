import { createHmac } from "crypto";

import { DiagonalError, ErrorType } from "src/error";

import { InvalidPayloadError } from "../errors";
import { construct } from "../event";

import { testConfig } from "./utils";

class NoErrorThrownError extends Error {}

describe("Webhook event", () => {
    function getConstructEventError(
        payload?: unknown,
        signature?: string,
        secret?: string
    ): DiagonalError {
        try {
            construct(
                payload ?? testConfig.subscriptionPayload,
                signature ?? testConfig.signatureHeader,
                secret ?? testConfig.endpointSecret
            );
            throw new NoErrorThrownError();
        } catch (error: unknown) {
            return error as DiagonalError;
        }
    }

    describe("When validating the payload", () => {
        it("Should fail when is of invalid type", () => {
            const error = getConstructEventError("");
            expect(error).toStrictEqual(
                new InvalidPayloadError("Invalid payload type")
            );
        });

        it("Should fail if does not contain a valid serviceAddress field", async () => {
            const payload = {
                ...testConfig.subscriptionPayload,
                serviceId: "",
            };
            const error = getConstructEventError(payload);

            expect(error).toStrictEqual(
                new InvalidPayloadError(
                    "Invalid payload. Invalid uuid `serviceId` field."
                )
            );
        });

        it("Should fail if does not contain a valid customerAddress field", async () => {
            const payload = {
                ...testConfig.subscriptionPayload,
                customerAddress: undefined,
            };
            const error = getConstructEventError(payload);

            expect(error).toStrictEqual(
                new InvalidPayloadError(
                    "Invalid payload. Required `customerAddress` field."
                )
            );
        });

        it("Should fail if does not contain a valid superTokenAddress field", async () => {
            const payload = {
                ...testConfig.subscriptionPayload,
                token: "",
            };

            const error = getConstructEventError(payload);
            expect(error.type).toBe(ErrorType.InvalidSignature);
            expect(error.message).toContain("received '' `token` field.");
        });

        it("Should fail if does not contain a valid packageId field", async () => {
            const payload = {
                ...testConfig.subscriptionPayload,
                packageId: "",
            };
            const error = getConstructEventError(payload);
            expect(error).toStrictEqual(
                new InvalidPayloadError(
                    "Invalid payload. Invalid uuid `packageId` field."
                )
            );
        });

        it("Should fail if does not contain a valid event field", async () => {
            const payload1 = {
                ...testConfig.subscriptionPayload,
                type: "abc",
            };
            const payload2 = {
                ...testConfig.subscriptionPayload,
                type: "",
            };
            const error1 = getConstructEventError(payload1);
            expect(error1.type).toBe(ErrorType.InvalidSignature);
            expect(error1.message).toContain("received 'abc' `type` field.");

            const error2 = getConstructEventError(payload2);
            expect(error2.type).toBe(ErrorType.InvalidSignature);
            expect(error2.message).toContain("received '' `type` field.");
        });

        it("Should fail if does not contain a valid chainId field", async () => {
            const payload1 = { ...testConfig.subscriptionPayload, chainId: 0 };
            const payload2 = {
                ...testConfig.subscriptionPayload,
                chainId: 1234,
            };
            const error1 = getConstructEventError(payload1);
            expect(error1.type).toBe(ErrorType.InvalidSignature);
            expect(error1.message).toContain("received '0' `chainId` field.");

            const error2 = getConstructEventError(payload2);
            expect(error2.type).toBe(ErrorType.InvalidSignature);
            expect(error2.message).toContain(
                "received '1234' `chainId` field."
            );
        });
    });

    describe("When validating the signature header", () => {
        it.each([
            "",
            `t=${testConfig.timestamp}`,
            "v0=c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
            `${testConfig.timestamp}`,
            "c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
            `t${testConfig.timestamp},v0=c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd`,
            `t=${testConfig.timestamp},v0c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd`,
            `${testConfig.timestamp},c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd`,
            `t=${testConfig.timestamp},v0=c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962cced`,
        ])(
            "Should fail when if signatureHeader provided is '%s'",
            (invalidSigHeader) => {
                const error = getConstructEventError(
                    testConfig.subscriptionPayload,
                    invalidSigHeader
                );

                expect(error.type).toBe(ErrorType.InvalidSignature);
                expect(error.message).toContain("Invalid signature header.");
            }
        );
    });

    describe("When verifying the endpoint secret", () => {
        it("Should fail if empty", async () => {
            const error = getConstructEventError(
                testConfig.subscriptionPayload,
                testConfig.signatureHeader,
                ""
            );

            expect(error.type).toBe(ErrorType.InvalidSignature);
            expect(error.message).toContain("Invalid endpointSecret.");
        });

        it("Should fail if invalid", async () => {
            const error = getConstructEventError(
                testConfig.subscriptionPayload,
                testConfig.signatureHeader,
                testConfig.endpointSecret.slice(
                    0,
                    testConfig.endpointSecret.length - 1
                )
            );

            expect(error.type).toBe(ErrorType.InvalidSignature);
            expect(error.message).toContain("Invalid endpointSecret.");
        });
    });

    describe("When verifying the signature header", () => {
        it("Should fail if timestamp is invalid", async () => {
            const newTimestamp = testConfig.timestamp;
            const oldTimestamp = Date.now() - 10;

            const payloadString = JSON.stringify(
                testConfig.subscriptionPayload
            );
            const payloadWithTimestamp = `${payloadString}${oldTimestamp}`;
            const signedPayload = createHmac(
                "sha256",
                testConfig.endpointSecret
            )
                .update(payloadWithTimestamp)
                .digest("hex");
            // modified signature header (timestamp)
            const signatureHeader = `t=${newTimestamp},v0=${signedPayload}`;

            const error = getConstructEventError(
                testConfig.subscriptionPayload,
                signatureHeader
            );
            expect(error.type).toBe(ErrorType.InvalidSignature);
            expect(error.message).toContain("Invalid signature.");
        });

        it("Should fail if timestamp is too old", async () => {
            const oldTimestamp = Date.now() - 6 * 60 * 1000; // 6 min ago

            const payloadString = JSON.stringify(
                testConfig.subscriptionPayload
            );
            const payloadWithTimestamp = `${payloadString}${oldTimestamp}`;
            const signedPayload = createHmac(
                "sha256",
                testConfig.endpointSecret
            )
                .update(payloadWithTimestamp)
                .digest("hex");
            const signatureHeader = `t=${oldTimestamp},v0=${signedPayload}`;

            const error = getConstructEventError(
                testConfig.subscriptionPayload,
                signatureHeader
            );
            expect(error.type).toBe(ErrorType.InvalidSignature);
            expect(error.message).toContain("Signature too old.");
        });

        it("Should fail if header payload is invalid", async () => {
            const timestamp = Date.now();

            // subscriber address with the last character changed
            const newPayload = {
                ...testConfig.subscriptionPayload,
                subscriber: "0x4Ea66bE6947D711Ed963fc4aa8c04c5a4da6959C",
            };
            const payloadString = JSON.stringify(newPayload);

            const payloadWithTimestamp = `${payloadString}${timestamp}`;
            const signedPayload = createHmac(
                "sha256",
                testConfig.endpointSecret
            )
                .update(payloadWithTimestamp)
                .digest("hex");

            // modified signature header (payload)
            const signatureHeader = `t=${timestamp},v0=${signedPayload}`;

            const error = getConstructEventError(
                testConfig.subscriptionPayload,
                signatureHeader
            );
            expect(error.type).toBe(ErrorType.InvalidSignature);
            expect(error.message).toContain("Invalid signature.");
        });

        it("Should fail if body is invalid", async () => {
            // address with the last character changed
            const subscriptionPayload = {
                ...testConfig.subscriptionPayload,
                subscriber: "0x4Ea66bE6947D711Ed963fc4aa8c04c5a4da6959C",
            };

            const error = getConstructEventError(subscriptionPayload);
            expect(error.type).toBe(ErrorType.InvalidSignature);
            expect(error.message).toContain("Invalid signature.");
        });

        it("Should fail if endpointSecret is invalid", async () => {
            // endpointSecret with the last character changed
            const endpointSecret1 =
                "788284448d0ffabed8b47e6ed1848de4b7522257f6b516a7cc75e6da15905cb2";

            const error = getConstructEventError(
                testConfig.subscriptionPayload,
                testConfig.signatureHeader,
                endpointSecret1
            );
            expect(error.type).toBe(ErrorType.InvalidSignature);
            expect(error.message).toContain("Invalid signature.");
        });
    });

    describe("When constructing a valid webhook event", () => {
        it("Should be completed successfully", async () => {
            const packageId = "3021437c-1ecc-4bd8-9df6-1d37b077ba08";

            const payload = {
                ...testConfig.subscriptionPayload,
                packageId,
            };

            const payloadString = JSON.stringify(payload);
            const payloadWithTimestamp = `${payloadString}${testConfig.timestamp}`;

            const signedPayload = createHmac(
                "sha256",
                testConfig.endpointSecret
            )
                .update(payloadWithTimestamp)
                .digest("hex");

            const signatureHeader = `t=${testConfig.timestamp},v0=${signedPayload}`;

            const event = construct(
                {
                    ...testConfig.subscriptionPayload,
                    packageId,
                },
                signatureHeader,
                testConfig.endpointSecret
            );

            expect(event.customerAddress).toEqual(
                testConfig.subscriptionPayload.customerAddress
            );
            expect(event.serviceId).toEqual(
                testConfig.subscriptionPayload.serviceId
            );
            expect(event.token).toEqual(testConfig.subscriptionPayload.token);
            expect(event.packageId).toEqual(packageId);
            expect(event.chainId).toEqual(
                testConfig.subscriptionPayload.chainId
            );
            expect(event.type).toEqual(testConfig.subscriptionPayload.type);
        });
    });
});
