import { test } from "mocha";
import {
    Diagonal,
    InvalidEndpointSecretError,
    InvalidPayloadError,
    InvalidSignatureHeaderError,
} from "../src";

import { testConfig } from "./utils";

import { createHmac } from "crypto";
import { InvalidSignatureError } from "../src/error";

// Diagonal class tests
describe("Diagonal tests", () => {
    describe("Invalid payload tests", () => {
        it("Should fail when the payload is of invalid type", () => {
            const diagonal = new Diagonal();
            const eventF = () =>
                diagonal.constructEvent(
                    "",
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );
            expect(eventF).toThrow("Invalid payload type");
            expect(eventF).toThrow(InvalidPayloadError);
        });

        it("Should fail when the payload does not contain valid service field", async () => {
            const diagonal = new Diagonal();
            const payload = { ...testConfig.subscriptionPayload, service: "" };

            const eventF = () =>
                diagonal.constructEvent(
                    payload,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );

            expect(eventF).toThrow("Invalid payload `service` adddress field.");
            expect(eventF).toThrow(InvalidPayloadError);
        });

        it("Should fail when the payload does not contain valid subscriber field", async () => {
            const diagonal = new Diagonal();
            const payload = {
                ...testConfig.subscriptionPayload,
                subscriber: "",
            };

            const eventF = () =>
                diagonal.constructEvent(
                    payload,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );

            expect(eventF).toThrow(
                "Invalid payload `subscriber` adddress field."
            );
            expect(eventF).toThrow(InvalidPayloadError);
        });

        it("Should fail when the payload does not contain valid superToken field", async () => {
            const diagonal = new Diagonal();
            const payload = {
                ...testConfig.subscriptionPayload,
                superToken: "",
            };
            const eventF = () =>
                diagonal.constructEvent(
                    payload,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );
            expect(eventF).toThrow(
                "Invalid payload `superToken` adddress field."
            );
            expect(eventF).toThrow(InvalidPayloadError);
        });

        it("Should fail when the payload does not contain valid packageId field", async () => {
            const diagonal = new Diagonal();
            const payload = { ...testConfig.subscriptionPayload, packageId: 0 };
            const eventF = () =>
                diagonal.constructEvent(
                    payload,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );
            expect(eventF).toThrow("Invalid payload `packageId` field.");
            expect(eventF).toThrow(InvalidPayloadError);
        });

        it("Should fail when the payload does not contain valid flowRate field", async () => {
            const diagonal = new Diagonal();
            let payload1 = { ...testConfig.subscriptionPayload, flowRate: -1 };
            let payload2 = {
                ...testConfig.subscriptionPayload,
                flowRate: "15",
            };
            const eventF1 = () =>
                diagonal.constructEvent(
                    payload1,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );
            expect(eventF1).toThrow("Invalid payload `flowRate` field.");
            expect(eventF1).toThrow(InvalidPayloadError);

            const eventF2 = () =>
                diagonal.constructEvent(
                    payload2,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );

            expect(eventF2).toThrow("Invalid payload `flowRate` field.");
            expect(eventF2).toThrow(InvalidPayloadError);
        });

        it("Should fail when the payload does not contain valid feeRate field", async () => {
            const diagonal = new Diagonal();
            const payload1 = { ...testConfig.subscriptionPayload, feeRate: -1 };
            const payload2 = {
                ...testConfig.subscriptionPayload,
                feeRate: "15",
            };
            const eventF1 = () =>
                diagonal.constructEvent(
                    payload1,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );
            expect(eventF1).toThrow("Invalid payload `feeRate` field.");
            expect(eventF1).toThrow(InvalidPayloadError);

            const eventF2 = () =>
                diagonal.constructEvent(
                    payload2,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );

            expect(eventF2).toThrow("Invalid payload `feeRate` field.");
            expect(eventF2).toThrow(InvalidPayloadError);
        });

        it("Should fail when the payload does not contain valid eventType field", async () => {
            const diagonal = new Diagonal();
            const payload1 = {
                ...testConfig.subscriptionPayload,
                eventType: "abc",
            };
            const payload2 = {
                ...testConfig.subscriptionPayload,
                eventType: "",
            };

            const eventF1 = () =>
                diagonal.constructEvent(
                    payload1,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );

            expect(eventF1).toThrow("Invalid payload `eventType` field.");
            expect(eventF1).toThrow(InvalidPayloadError);

            const eventF2 = () =>
                diagonal.constructEvent(
                    payload2,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );

            expect(eventF2).toThrow("Invalid payload `eventType` field.");
            expect(eventF2).toThrow(InvalidPayloadError);
        });

        it("Should fail when the payload does not contain valid chainId field", async () => {
            const diagonal = new Diagonal();
            const payload1 = { ...testConfig.subscriptionPayload, chainId: 0 };
            const payload2 = {
                ...testConfig.subscriptionPayload,
                chainId: 1234,
            };

            const eventF1 = () =>
                diagonal.constructEvent(
                    payload1,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );

            expect(eventF1).toThrow("Invalid payload `chainId` field.");
            expect(eventF1).toThrow(InvalidPayloadError);

            const eventF2 = () =>
                diagonal.constructEvent(
                    payload2,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );

            expect(eventF2).toThrow("Invalid payload `chainId` field.");
            expect(eventF2).toThrow(InvalidPayloadError);
        });
    });

    describe("Invalid signatureHeader tests", () => {
        it("Should fail when the signatureHeader is invalid", async () => {
            const diagonal = new Diagonal();
            for (const invalidSigHeader of testConfig.invalidSignatureHeaders) {
                const eventF = () =>
                    diagonal.constructEvent(
                        testConfig.subscriptionPayload,
                        invalidSigHeader,
                        testConfig.endpointSecret
                    );
                expect(eventF).toThrow("Invalid signature header.");
                expect(eventF).toThrow(InvalidSignatureHeaderError);
            }
        });
    });

    describe("Invalid endpointSecret tests", () => {
        it("Should fail when the endpointSecret is empty", async () => {
            const diagonal = new Diagonal();
            const eventF = () =>
                diagonal.constructEvent(
                    testConfig.subscriptionPayload,
                    testConfig.signatureHeader,
                    ""
                );
            expect(eventF).toThrow("Invalid endpointSecret.");
            expect(eventF).toThrow(InvalidEndpointSecretError);
        });

        it("Should fail when the endpointSecret is invalid", async () => {
            const diagonal = new Diagonal();
            const eventF = () =>
                diagonal.constructEvent(
                    testConfig.subscriptionPayload,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret.slice(
                        0,
                        testConfig.endpointSecret.length - 1
                    )
                );
            expect(eventF).toThrow("Invalid endpointSecret.");
            expect(eventF).toThrow(InvalidEndpointSecretError);
        });
    });

    describe("Invalid signature verification tests", () => {
        it("Should fail when the signature header timestamp is invalid", async () => {
            const diagonal = new Diagonal();

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
            let signatureHeader = `t=${newTimestamp},v0=${signedPayload}`;

            const eventF = () =>
                diagonal.constructEvent(
                    testConfig.subscriptionPayload,
                    signatureHeader,
                    testConfig.endpointSecret
                );

            expect(eventF).toThrow("Invalid signature.");
            expect(eventF).toThrow(InvalidSignatureError);
        });

        it("Should fail when the signature header payload is invalid", async () => {
            const diagonal = new Diagonal();

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
            let signatureHeader = `t=${timestamp},v0=${signedPayload}`;

            const eventF = () =>
                diagonal.constructEvent(
                    testConfig.subscriptionPayload,
                    signatureHeader,
                    testConfig.endpointSecret
                );

            expect(eventF).toThrow("Invalid signature.");
            expect(eventF).toThrow(InvalidSignatureError);
        });

        it("Should fail when the signature body is invalid", async () => {
            const diagonal = new Diagonal();

            // address with the last character changed
            const subscriptionPayload = {
                ...testConfig.subscriptionPayload,
                subscriber: "0x4Ea66bE6947D711Ed963fc4aa8c04c5a4da6959C",
            };

            const eventF = () =>
                diagonal.constructEvent(
                    subscriptionPayload,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );

            expect(eventF).toThrow("Invalid signature.");
            expect(eventF).toThrow(InvalidSignatureError);
        });

        it("Should fail when the endpointSecret is invalid", async () => {
            const diagonal = new Diagonal();

            // endpointSecret with the last character changed
            const endpointSecret1 =
                "788284448d0ffabed8b47e6ed1848de4b7522257f6b516a7cc75e6da15905cb2";

            const eventF = () =>
                diagonal.constructEvent(
                    testConfig.subscriptionPayload,
                    testConfig.signatureHeader,
                    endpointSecret1
                );

            expect(eventF).toThrow("Invalid signature.");
            expect(eventF).toThrow(InvalidSignatureError);
        });
    });

    describe("Successful verification tests", () => {
        it("Event should be verified successfully", async () => {
            const diagonal = new Diagonal();

            const event = diagonal.constructEvent(
                testConfig.subscriptionPayload,
                testConfig.signatureHeader,
                testConfig.endpointSecret
            );

            expect(event.subscriber).toEqual(
                testConfig.subscriptionPayload.subscriber
            );
            expect(event.service).toEqual(
                testConfig.subscriptionPayload.service
            );
            expect(event.superToken).toEqual(
                testConfig.subscriptionPayload.superToken
            );
            expect(event.packageId).toEqual(
                testConfig.subscriptionPayload.packageId
            );
            expect(event.flowRate).toEqual(
                testConfig.subscriptionPayload.flowRate
            );
            expect(event.feeRate).toEqual(
                testConfig.subscriptionPayload.feeRate
            );
            expect(event.chainId).toEqual(
                testConfig.subscriptionPayload.chainId
            );
            expect(event.eventType).toEqual(
                testConfig.subscriptionPayload.eventType
            );
        });
    });
});
