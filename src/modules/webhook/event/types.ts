import { ChainId } from "../../../config/chains";
import { Token } from "../../../config/tokens";

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
    serviceAddress: string;

    token: Token;
    packageId: string;
    chainId: ChainId;
}

export interface ISignatureHeader {
    timestamp: string;
    signature: string;
}
