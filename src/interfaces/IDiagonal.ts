import { IEvent, IWebhookData } from "../types";

export interface IDiagonal {
    constructEvent(
        payload: IWebhookData | any,
        signatureHeader: string,
        endpointSecret: string
    ): IEvent;
}
