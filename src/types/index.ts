export enum WebhookEventType {
    SUBSCRIPTION_ACKNOWLEDGED = "SUBSCRIPTION_ACKNOWLEDGED",
    SUBSCRIPTION_FINALIZED = "SUBSCRIPTION_FINALIZED",
    SUBSCRIPTION_REORGED = "SUBSCRIPTION_REORGED",
    UNSUBSCRIBED = "UNSUBSCRIBED",
}

export interface IWebhookData {
    event: WebhookEventType;
    externalCustomerId: string;
    customerAddress: string;
    serviceAddress: string;
    superTokenAddress: string;
    flowRate: string;
    packageId: number;
    chainId: number;
}

export type IEvent = IWebhookData;

export interface ISignatureHeader {
    timestamp: string;
    signature: string;
}

export interface ICheckoutSessionInput {
    externalCustomerId: string;
    serviceAddress: string;
    packageRegistryId: number;
    chainId: number;
    cancelUrl: string;
    successUrl: string;
    expiresAt?: Date;
}

export interface ICheckoutSessionResponse {
    uuid: string;
    cancelUrl: string;
    successUrl: string;
    url: string; // redirect url
}

export interface Config {
    diagonalBackendUrl: string;
}
