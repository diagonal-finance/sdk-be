import {
    ICheckoutSessionInput,
    ICheckoutSessionResponse,
} from "../modules/checkout/session/types";
export interface ICheckoutSessions {
    create(
        checkoutSessionInput: ICheckoutSessionInput
    ): Promise<ICheckoutSessionResponse>;
}
