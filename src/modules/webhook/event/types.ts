
import { ChainId } from "../../../config/chains";
import { Token } from "../../../config/tokens";

export enum Event {
    SUBSCRIPTION_ACKNOWLEDGED = "SUBSCRIPTION_ACKNOWLEDGED",
    SUBSCRIPTION_FINALIZED = "SUBSCRIPTION_FINALIZED",
    SUBSCRIPTION_REORGED = "SUBSCRIPTION_REORGED",
    UNSUBSCRIBED = "UNSUBSCRIBED",
}

export interface IWebhookEvent {
    event: Event;
    
    customerId: string;
    
    customerAddress: string;
    serviceAddress: string;
    
    token: Token;
    packageId: number;
    chainId: ChainId;
}

export interface ISignatureHeader {
    timestamp: string;
    signature: string;
}
