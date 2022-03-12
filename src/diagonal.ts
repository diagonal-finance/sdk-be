import { createHmac } from "crypto";

import {
    InvalidEndpointSecretError,
    InvalidPayloadError,
    InvalidSignatureError,
    InvalidSignatureHeaderError,
} from "./error";
import { IDiagonal } from "./interfaces";
import { IEvent, ISignatureHeader, ISubscriptionData } from "./types";
import {
    isValidAddress,
    isValidChainId,
    isValidEventType,
    isValidFlowRate,
    signatureHeaderElementsValid,
} from "./utils";

/**
 * Diagonal is the main class of the backend SDK. It is the main
 * entry point, and a class that should be used to initialize the SDK.
 */
export default class Diagonal implements IDiagonal {
    /**
     * Create and return IEvent object, while validating the input payload and
     * signatures. Throws an error if the payload or the signature are not valid.
     * @param payload The payload of the request
     * @param signatureHeader The value of the `Diagonal-Signature` header
     * @param endpointSecret The endpoint secret for the webhook
     * @returns An IEvent object
     */
    public constructEvent(
        payload: ISubscriptionData | any,
        signatureHeader: string,
        endpointSecret: string
    ): IEvent {
        // throws an error if the payload is invalid
        this.verifyPayload(payload);

        // throws an error if the endpoint secret is invalid
        this.verifyEndpointSecret(endpointSecret);

        const parsedSignatureHeader =
            this.parseSignatureHeader(signatureHeader);

        // throws an error if signature is invalid
        this.verifySignature(
            JSON.stringify(payload),
            parsedSignatureHeader,
            endpointSecret
        );

        return payload as IEvent;
    }

    private verifyPayload(payload: ISubscriptionData | any): void {
        if (typeof payload !== "object")
            throw new InvalidPayloadError("Invalid payload type");

        if (!isValidAddress(payload["service"]))
            throw new InvalidPayloadError(
                "Invalid payload `service` adddress field."
            );
        if (!isValidAddress(payload["subscriber"]))
            throw new InvalidPayloadError(
                "Invalid payload `subscriber` adddress field."
            );
        if (!isValidAddress(payload["superToken"]))
            throw new InvalidPayloadError(
                "Invalid payload `superToken` adddress field."
            );
        if (!(payload["packageId"] > 0))
            throw new InvalidPayloadError("Invalid payload `packageId` field.");
        if (!isValidFlowRate(payload["flowRate"]))
            throw new InvalidPayloadError("Invalid payload `flowRate` field.");
        if (!isValidFlowRate(payload["feeRate"]))
            throw new InvalidPayloadError("Invalid payload `feeRate` field.");
        if (!isValidEventType(payload["eventType"]))
            throw new InvalidPayloadError("Invalid payload `eventType` field.");
        if (!isValidChainId(payload["chainId"]))
            throw new InvalidPayloadError("Invalid payload `chainId` field.");
    }

    private verifyEndpointSecret(endpointSecret: string): void {
        if (
            typeof endpointSecret !== "string" ||
            endpointSecret === "" ||
            endpointSecret.length !== 64
        )
            throw new InvalidEndpointSecretError("Invalid endpointSecret.");
    }

    private parseSignatureHeader(signatureHeader: string): ISignatureHeader {
        const signatureHeaderElements = (signatureHeader as string).split(",");
        if (!signatureHeaderElementsValid(signatureHeaderElements))
            throw new InvalidSignatureHeaderError("Invalid signature header.");

        const timestamp = (signatureHeaderElements[0] as string).split("=")[1];
        const signature = (signatureHeaderElements[1] as string).split("=")[1];

        const parsedSignatureHeader: ISignatureHeader = {
            timestamp: timestamp as string,
            signature: signature as string,
        };

        return parsedSignatureHeader;
    }

    private verifySignature(
        payload: string,
        signatureHeader: ISignatureHeader,
        endpointSecret: string
    ): void {
        try {
            const payloadWithTimestamp = `${payload}${signatureHeader.timestamp}`;
            const signedPayload = createHmac("sha256", endpointSecret)
                .update(payloadWithTimestamp)
                .digest("hex");
            if (signedPayload !== signatureHeader.signature) {
                throw new InvalidSignatureError("Invalid signature.");
            }
        } catch (e) {
            throw new InvalidSignatureError("Invalid signature.");
        }
    }
}
