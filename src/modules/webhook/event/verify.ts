import { createHmac } from "crypto";

import { z } from "zod";

import { ChainZod, EthereumAddressZod, PackageIdZod, TokenZod } from "../../../utils/validators";

import {
    InvalidEndpointSecretError,
    InvalidPayloadError,
    InvalidSignatureError,
} from "./errors";
import { Event, ISignatureHeader, IWebhookEvent } from "./types";

const EventEnum = z.nativeEnum(Event);

const WebhookEvent: z.ZodType<IWebhookEvent> = z.object({
    event: EventEnum,
    customerId: z.string(),

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
