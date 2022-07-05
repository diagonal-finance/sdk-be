import {
    ICheckoutSession,
    ICreateCheckoutSessionInput,
} from "../modules/checkout/session/types";
export interface ICheckoutSessions {
    create(input: ICreateCheckoutSessionInput): Promise<ICheckoutSession>;
}
