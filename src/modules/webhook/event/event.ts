import { InvalidSignatureHeaderError } from "./errors";
import { ISignatureHeader, IWebhookEvent } from "./types";
import {
    isSignatureHeaderFormatValid,
    verifyEndpointSecret,
    verifyPayload,
    verifySignature,
    verifySignatureTimestamp,
} from "./verify";

/**
 * Create and return IEvent object, while validating the input payload and
 * signatures. Throws an error if the payload or the signature are not valid.
 * @param payload The payload of the request
 * @param signatureHeader The value of the `Diagonal-Signature` header
 * @param endpointSecret The endpoint secret for the webhook
 * @returns An IEvent object
 */
export function construct(
    payload: unknown,
    signatureHeader: string,
    endpointSecret: string
): IWebhookEvent {
    // throws an error if the payload is invalid
    verifyPayload(payload);

    // throws an error if the endpoint secret is invalid
    verifyEndpointSecret(endpointSecret);

    const parsedSignatureHeader = parseSignatureHeader(signatureHeader);

    // throws an error if the timestamp is too old
    verifySignatureTimestamp(parsedSignatureHeader.timestamp);

    // throws an error if signature is invalid
    verifySignature(
        JSON.stringify(payload),
        parsedSignatureHeader,
        endpointSecret
    );

    return payload as IWebhookEvent;
}

function parseSignatureHeader(signatureHeader: string): ISignatureHeader {
    if (!isSignatureHeaderFormatValid(signatureHeader))
        throw new InvalidSignatureHeaderError("Invalid signature header.");

    const signatureHeaderElements = signatureHeader.split(",") as [
        string,
        string
    ];

    const timestamp = signatureHeaderElements[0].split("=")[1]!;
    const signature = signatureHeaderElements[1].split("=")[1]!;

    const parsedSignatureHeader: ISignatureHeader = {
        timestamp,
        signature,
    };

    return parsedSignatureHeader;
}
