import {
    ICheckoutSession,
    ICreateCheckoutSessionInput,
} from "src/modules/checkout/session/types";
export interface ICheckoutSessions {
    create(input: ICreateCheckoutSessionInput): Promise<ICheckoutSession>;
}
