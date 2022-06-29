import { ChainId } from "src/config/chains";

export interface ICreateCheckoutSessionInput {
    customerId: string;
    packageId: number;
    chainIds?: ChainId[];
    cancelUrl: string;
    successUrl: string;
    expiresAt?: Date;
}

export interface ICheckoutSession {
    id: string;
    url: string;
}
