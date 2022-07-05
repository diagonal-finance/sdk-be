import { createHmac } from "crypto";

import {
    InvalidEndpointSecretError,
    InvalidPayloadError,
    InvalidSignatureError,
    InvalidSignatureHeaderError,
} from "../errors";
import { construct } from "../event";

import { testConfig } from "./utils";

describe("Webhook event", () => {
    function constructEventFn(
        payload?: unknown,
        signature?: string,
        secret?: string
    ) {
        return () =>
            construct(
                payload ?? testConfig.subscriptionPayload,
                signature ?? testConfig.signatureHeader,
                secret ?? testConfig.endpointSecret
            );
    }

    describe("When validating the payload", () => {
        it("Should fail when is of invalid type", () => {
            expect(constructEventFn("")).toThrow(
                new InvalidPayloadError("Invalid payload type")
            );
        });

        it("Should fail if does not contain a valid serviceAddress field", async () => {
            const payload = {
                ...testConfig.subscriptionPayload,
                serviceAddress: "",
            };

            expect(constructEventFn(payload)).toThrow(InvalidPayloadError);
        });

        it("Should fail if does not contain a valid customerAddress field", async () => {
            const payload = {
                ...testConfig.subscriptionPayload,
                customerAddress: undefined,
            };
            expect(constructEventFn(payload)).toThrow(InvalidPayloadError);
        });

        it("Should fail if does not contain a valid superTokenAddress field", async () => {
            const payload = {
                ...testConfig.subscriptionPayload,
                token: "",
            };
            expect(constructEventFn(payload)).toThrow(InvalidPayloadError);
        });

        it("Should fail if does not contain a valid packageId field", async () => {
            const payload = {
                ...testConfig.subscriptionPayload,
                packageId: "",
            };
            expect(constructEventFn(payload)).toThrow(InvalidPayloadError);
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
            expect(constructEventFn(payload1)).toThrow(InvalidPayloadError);
            expect(constructEventFn(payload2)).toThrow(InvalidPayloadError);
        });

        it("Should fail if does not contain a valid chainId field", async () => {
            const payload1 = { ...testConfig.subscriptionPayload, chainId: 0 };
            const payload2 = {
                ...testConfig.subscriptionPayload,
                chainId: 1234,
            };
            expect(constructEventFn(payload1)).toThrow(InvalidPayloadError);
            expect(constructEventFn(payload2)).toThrow(InvalidPayloadError);
        });
    });

    describe("When validating the signature header", () => {
        it.each([
            "",
            "t=1647115932683",
            "v0=c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
            "1647115932683",
            "c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
            "t1647115932683,v0=c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
            "t=1647115932683,v0c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
            "1647115932683,c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
            "t=16471159326,v0=c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962cced",
        ])(
            "Should fail when if signatureHeader provided is '%s'",
            async (invalidSigHeader) => {
                expect(
                    constructEventFn(
                        testConfig.subscriptionPayload,
                        invalidSigHeader
                    )
                ).toThrow(
                    new InvalidSignatureHeaderError("Invalid signature header.")
                );
            }
        );
    });

    describe("When verifying the endpoint secret", () => {
        it("Should fail if empty", async () => {
            expect(
                constructEventFn(
                    testConfig.subscriptionPayload,
                    testConfig.signatureHeader,
                    ""
                )
            ).toThrow(
                new InvalidEndpointSecretError("Invalid endpointSecret.")
            );
        });

        it("Should fail if invalid", async () => {
            expect(
                constructEventFn(
                    testConfig.subscriptionPayload,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret.slice(
                        0,
                        testConfig.endpointSecret.length - 1
                    )
                )
            ).toThrow(
                new InvalidEndpointSecretError("Invalid endpointSecret.")
            );
        });
    });

    describe("When verifying the signature header", () => {
        it("Should fail if timestamp is invalid", async () => {
            const newTimestamp = Date.now();
            const oldTimestamp = "1647115932683";

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

            expect(
                constructEventFn(
                    testConfig.subscriptionPayload,
                    signatureHeader
                )
            ).toThrow(new InvalidSignatureError("Invalid signature."));
        });

        it("Should fail if header payload is invalid", async () => {
            const timestamp = "1647115932683";

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

            expect(
                constructEventFn(
                    testConfig.subscriptionPayload,
                    signatureHeader
                )
            ).toThrow(new InvalidSignatureError("Invalid signature."));
        });

        it("Should fail if body is invalid", async () => {
            // address with the last character changed
            const subscriptionPayload = {
                ...testConfig.subscriptionPayload,
                subscriber: "0x4Ea66bE6947D711Ed963fc4aa8c04c5a4da6959C",
            };

            expect(constructEventFn(subscriptionPayload)).toThrow(
                new InvalidSignatureError("Invalid signature.")
            );
        });

        it("Should fail if endpointSecret is invalid", async () => {
            // endpointSecret with the last character changed
            const endpointSecret1 =
                "788284448d0ffabed8b47e6ed1848de4b7522257f6b516a7cc75e6da15905cb2";

            expect(
                constructEventFn(
                    testConfig.subscriptionPayload,
                    testConfig.signatureHeader,
                    endpointSecret1
                )
            ).toThrow(new InvalidSignatureError("Invalid signature."));
        });
    });

    describe("When constructing a valid webhook event", () => {
        it("Should be done successfully", async () => {
            const event = construct(
                testConfig.subscriptionPayload,
                testConfig.signatureHeader,
                testConfig.endpointSecret
            );

            expect(event.customerAddress).toEqual(
                testConfig.subscriptionPayload.customerAddress
            );
            expect(event.serviceAddress).toEqual(
                testConfig.subscriptionPayload.serviceAddress
            );
            expect(event.token).toEqual(testConfig.subscriptionPayload.token);
            expect(event.packageId).toEqual(
                testConfig.subscriptionPayload.packageId
            );
            expect(event.chainId).toEqual(
                testConfig.subscriptionPayload.chainId
            );
            expect(event.type).toEqual(testConfig.subscriptionPayload.type);
        });
    });
});
