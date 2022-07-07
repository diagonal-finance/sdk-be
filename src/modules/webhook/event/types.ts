import { ChainId } from "src/config/chains";
import { Token } from "src/config/tokens";

export enum EventType {
    SubscriptionAcknowledged = "SUBSCRIPTION_ACKNOWLEDGED",
    SubscriptionFinalized = "SUBSCRIPTION_FINALIZED",
    SubscriptionReorged = "SUBSCRIPTION_REORGED",
    SubscriptionCanceled = "SUBSCRIPTION_CANCELED",
}

export interface IWebhookEvent {
    type: EventType;

    customerId: string;
    customerAddress: string;

    token: Token;

    serviceId: string;
    packageId: string;
    chainId: ChainId;
}

export interface ISignatureHeader {
    timestamp: string;
    signature: string;
}
