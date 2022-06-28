import { ICheckoutSessionInput, ICheckoutSessionResponse } from "../modules/checkout/types";

export interface ICheckoutSession {
    create(
        checkoutSessionInput: ICheckoutSessionInput
    ): Promise<ICheckoutSessionResponse>;
}
