import { createHmac } from "crypto";


import {
    InvalidEndpointSecretError,
    InvalidPayloadError,
    InvalidSignatureError,
    InvalidSignatureHeaderError,
} from "../errors";
import { construct } from "../event";

import { testConfig } from "./utils";

describe("Webhook event tests", () => {
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

    describe("Invalid payload tests", () => {
        it("Should fail when the payload is of invalid type", () => {
            expect(constructEventFn("")).toThrow(
                new InvalidPayloadError("Invalid payload type")
            );
        });

        it("Should fail when the payload does not contain valid serviceAddress field", async () => {
            const payload = {
                ...testConfig.subscriptionPayload,
                serviceAddress: "",
            };

            expect(constructEventFn(payload)).toThrow(InvalidPayloadError);
        });

        it("Should fail when the payload does not contain valid customerAddress field", async () => {
            const payload = {
                ...testConfig.subscriptionPayload,
                customerAddress: "",
            };
            expect(constructEventFn(payload)).toThrow(InvalidPayloadError);
        });

        it("Should fail when the payload does not contain valid superTokenAddress field", async () => {
            const payload = {
                ...testConfig.subscriptionPayload,
                token: "",
            };
            expect(constructEventFn(payload)).toThrow(InvalidPayloadError);
        });

        it("Should fail when the payload does not contain valid packageId field", async () => {
            const payload = { ...testConfig.subscriptionPayload, packageId: 0 };
            expect(constructEventFn(payload)).toThrow(InvalidPayloadError);
        });

        it("Should fail when the payload does not contain valid event field", async () => {
            const payload1 = {
                ...testConfig.subscriptionPayload,
                event: "abc",
            };
            const payload2 = {
                ...testConfig.subscriptionPayload,
                event: "",
            };
            expect(constructEventFn(payload1)).toThrow(InvalidPayloadError);
            expect(constructEventFn(payload2)).toThrow(InvalidPayloadError);
        });

        it("Should fail when the payload does not contain valid chainId field", async () => {
            const payload1 = { ...testConfig.subscriptionPayload, chainId: 0 };
            const payload2 = {
                ...testConfig.subscriptionPayload,
                chainId: 1234,
            };
            expect(constructEventFn(payload1)).toThrow(InvalidPayloadError);
            expect(constructEventFn(payload2)).toThrow(InvalidPayloadError);
        });
    });

    describe("Invalid signatureHeader tests", () => {
        it("Should fail when the signatureHeader is invalid", async () => {
            for (const invalidSigHeader of testConfig.invalidSignatureHeaders) {
                expect(
                    constructEventFn(
                        testConfig.subscriptionPayload,
                        invalidSigHeader
                    )
                ).toThrow(
                    new InvalidSignatureHeaderError("Invalid signature header.")
                );
            }
        });
    });

    describe("Invalid endpointSecret tests", () => {
        it("Should fail when the endpointSecret is empty", async () => {
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

        it("Should fail when the endpointSecret is invalid", async () => {
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

    describe("Invalid signature verification tests", () => {
        it("Should fail when the signature header timestamp is invalid", async () => {
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

        it("Should fail when the signature header payload is invalid", async () => {
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

        it("Should fail when the signature body is invalid", async () => {
            // address with the last character changed
            const subscriptionPayload = {
                ...testConfig.subscriptionPayload,
                subscriber: "0x4Ea66bE6947D711Ed963fc4aa8c04c5a4da6959C",
            };

            expect(constructEventFn(subscriptionPayload)).toThrow(
                new InvalidSignatureError("Invalid signature.")
            );
        });

        it("Should fail when the endpointSecret is invalid", async () => {
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

    describe("Successful verification tests", () => {
        it("Event should be verified successfully", async () => {
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
            expect(event.token).toEqual(
                testConfig.subscriptionPayload.token
            );
            expect(event.packageId).toEqual(
                testConfig.subscriptionPayload.packageId
            );
            expect(event.chainId).toEqual(
                testConfig.subscriptionPayload.chainId
            );
            expect(event.event).toEqual(testConfig.subscriptionPayload.event);
        });
    });
});