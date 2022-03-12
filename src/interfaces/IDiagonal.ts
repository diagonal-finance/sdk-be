import { IEvent, ISubscriptionData } from "../types";

export interface IDiagonal {
    constructEvent(
        payload: ISubscriptionData | any,
        signatureHeader: string,
        endpointSecret: string
    ): IEvent;
}
