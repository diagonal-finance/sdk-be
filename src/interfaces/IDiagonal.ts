import { ICheckoutSession } from "./ICheckoutSession";
import { IWebhook } from "./IWebhook";

export interface IDiagonal {
    get webhook(): IWebhook;
    get checkoutSession(): ICheckoutSession;
}
