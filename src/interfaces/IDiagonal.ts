import { ICheckoutSession } from "./ICheckoutSession";

export interface IDiagonal {
    get checkoutSession(): ICheckoutSession;
}
