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
