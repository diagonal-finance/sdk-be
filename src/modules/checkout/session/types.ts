import { ChainId } from "src/config/chains";

export interface ICreateCheckoutSessionInput {
    customerId: string;
    packageId: number;
    chainIds?: ChainId[];
    cancelUrl: URL;
    successUrl: URL;
    expiresAt?: Date;
}

export interface ICheckoutSession {
    id: string;
    url: string;
}
