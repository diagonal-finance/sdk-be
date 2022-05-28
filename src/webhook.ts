import { createHmac } from "crypto";

import {
    InvalidEndpointSecretError,
    InvalidPayloadError,
    InvalidSignatureError,
    InvalidSignatureHeaderError,
} from "./error";
import { IWebhook } from "./interfaces/IWebhook";
import { IEvent, ISignatureHeader, IWebhookData } from "./types";
import {
    isValidAddress,
    isValidChainId,
    isValidEventType,
    isValidFlowRate,
    signatureHeaderElementsValid,
} from "./utils";

/**
 * Class for handling webhook events
 */
export default class Webhook implements IWebhook {
    /**
     * Create and return IEvent object, while validating the input payload and
     * signatures. Throws an error if the payload or the signature are not valid.
     * @param payload The payload of the request
     * @param signatureHeader The value of the `Diagonal-Signature` header
     * @param endpointSecret The endpoint secret for the webhook
     * @returns An IEvent object
     */
    public constructEvent(
        payload: IWebhookData | any,
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

    private verifyPayload(payload: IWebhookData | any): void {
        if (typeof payload !== "object")
            throw new InvalidPayloadError("Invalid payload type");

        if (!isValidAddress(payload["serviceAddress"]))
            throw new InvalidPayloadError(
                "Invalid payload `serviceAddress` field."
            );
        if (!isValidAddress(payload["customerAddress"]))
            throw new InvalidPayloadError(
                "Invalid payload `customerAddress` field."
            );
        if (!isValidAddress(payload["superTokenAddress"]))
            throw new InvalidPayloadError(
                "Invalid payload `superTokenAddress` field."
        );
        if (!(payload["packageId"] > 0))
            throw new InvalidPayloadError("Invalid payload `packageId` field.");
        if (!isValidFlowRate(payload["flowRate"]))
            throw new InvalidPayloadError("Invalid payload `flowRate` field.");
        if (!isValidEventType(payload["event"]))
            throw new InvalidPayloadError("Invalid payload `event` field.");
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
