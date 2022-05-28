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

        it("Should fail when the payload does not contain valid serviceAddress field", async () => {
            const diagonal = new Diagonal();
            const payload = { ...testConfig.subscriptionPayload, serviceAddress: "" };

            const eventF = () =>
                diagonal.constructEvent(
                    payload,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );

            expect(eventF).toThrow("Invalid payload `serviceAddress` field.");
            expect(eventF).toThrow(InvalidPayloadError);
        });

        it("Should fail when the payload does not contain valid customerAddress field", async () => {
            const diagonal = new Diagonal();
            const payload = {
                ...testConfig.subscriptionPayload,
                customerAddress: "",
            };

            const eventF = () =>
                diagonal.constructEvent(
                    payload,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );

            expect(eventF).toThrow(
                "Invalid payload `customerAddress` field."
            );
            expect(eventF).toThrow(InvalidPayloadError);
        });

        it("Should fail when the payload does not contain valid superTokenAddress field", async () => {
            const diagonal = new Diagonal();
            const payload = {
                ...testConfig.subscriptionPayload,
                superTokenAddress: "",
            };
            const eventF = () =>
                diagonal.constructEvent(
                    payload,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );
            expect(eventF).toThrow(
                "Invalid payload `superTokenAddress` field."
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
            let payload1 = { ...testConfig.subscriptionPayload, flowRate: "-1" };
            let payload2 = {
                ...testConfig.subscriptionPayload,
                flowRate: 1,
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

        it("Should fail when the payload does not contain valid event field", async () => {
            const diagonal = new Diagonal();
            const payload1 = {
                ...testConfig.subscriptionPayload,
                event: "abc",
            };
            const payload2 = {
                ...testConfig.subscriptionPayload,
                event: "",
            };

            const eventF1 = () =>
                diagonal.constructEvent(
                    payload1,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );

            expect(eventF1).toThrow("Invalid payload `event` field.");
            expect(eventF1).toThrow(InvalidPayloadError);

            const eventF2 = () =>
                diagonal.constructEvent(
                    payload2,
                    testConfig.signatureHeader,
                    testConfig.endpointSecret
                );

            expect(eventF2).toThrow("Invalid payload `event` field.");
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

            expect(event.customerAddress).toEqual(
                testConfig.subscriptionPayload.customerAddress
            );
            expect(event.serviceAddress).toEqual(
                testConfig.subscriptionPayload.serviceAddress
            );
            expect(event.superTokenAddress).toEqual(
                testConfig.subscriptionPayload.superTokenAddress
            );
            expect(event.packageId).toEqual(
                testConfig.subscriptionPayload.packageId
            );
            expect(event.flowRate).toEqual(
                testConfig.subscriptionPayload.flowRate
            );
            expect(event.chainId).toEqual(
                testConfig.subscriptionPayload.chainId
            );
            expect(event.event).toEqual(
                testConfig.subscriptionPayload.event
            );
        });
    });
});
