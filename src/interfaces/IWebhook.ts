import { IEvent, IWebhookData } from "../types";

export interface IWebhook {
    constructEvent(
        payload: IWebhookData | any,
        signatureHeader: string,
        endpointSecret: string
    ): IEvent;
}
