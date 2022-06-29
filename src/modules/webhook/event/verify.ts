import { createHmac } from "crypto";

import {
    ChainZod,
    EthereumAddressZod,
    PackageIdZod,
    TokenZod,
} from "src/utils/zod";
import { z } from "zod";

import {
    InvalidEndpointSecretError,
    InvalidPayloadError,
    InvalidSignatureError,
} from "./errors";
import { EventType, ISignatureHeader, IWebhookEvent } from "./types";

const EventTypeEnum = z.nativeEnum(EventType);

const WebhookEvent: z.ZodType<IWebhookEvent> = z.object({
    type: EventTypeEnum,
    customerId: z.string().min(1),

    customerAddress: EthereumAddressZod,
    serviceAddress: EthereumAddressZod,
    token: TokenZod,
    packageId: PackageIdZod,
    chainId: ChainZod,
});

export function verifyPayload(payload: any): void {
    if (typeof payload !== "object")
        throw new InvalidPayloadError("Invalid payload type");

    const result = WebhookEvent.safeParse(payload);
    if (result.success) return;

    const issues = result.error.issues;
    for (const issue of issues) {
        const path = issue.path.reduce((prev, value) => prev + "," + value);
        throw new InvalidPayloadError(
            `Invalid payload. ${issue.message} \`${path}\` field.`
        );
    }
}

export function verifyEndpointSecret(endpointSecret: string): void {
    if (
        typeof endpointSecret !== "string" ||
        endpointSecret === "" ||
        endpointSecret.length !== 64
    )
        throw new InvalidEndpointSecretError("Invalid endpointSecret.");
}

export function verifySignature(
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

export const isSignatureHeaderFormatValid = (
    signatureHeader: string
): boolean => {
    if (typeof signatureHeader !== "string") return false;
    const signatureHeaderElements = signatureHeader.split(",");

    if (signatureHeaderElements.length !== 2) return false;
    if (typeof signatureHeaderElements[0] !== "string") return false;
    if (typeof signatureHeaderElements[1] !== "string") return false;

    const timestampFields = signatureHeaderElements[0].split("=");
    const signatureFields = signatureHeaderElements[1].split("=");
    if (timestampFields[0] !== "t") return false;
    if (signatureFields[0] !== "v0") return false;

    if (timestampFields[1]?.length !== 13) return false;
    if (signatureFields[1]?.length !== 64) return false;

    return true;
};
