import { ICheckoutSessionInput, ICheckoutSessionResponse } from "../types";

export interface ICheckoutSession {
    create(
        checkoutSessionInput: ICheckoutSessionInput
    ): Promise<ICheckoutSessionResponse>;
}
