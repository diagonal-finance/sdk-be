export enum SubscriptionEventType {
    SUBSCRIBE = "SUBSCRIBE",
    UNSUBSCRIBE = "UNSUBSCRIBE",
}

export interface ISubscriptionData {
    service: string;
    subscriber: string;
    superToken: string;
    packageId: number;
    flowRate: number;
    feeRate: number;
    eventType: SubscriptionEventType;
    chainId: number;
}

export type IEvent = ISubscriptionData;

export interface ISignatureHeader {
    timestamp: string;
    signature: string;
}
