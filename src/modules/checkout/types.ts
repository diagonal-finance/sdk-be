import { ChainId } from "src/config/chains";

export interface ICheckoutSessionInput {
    customerId: string;
    packageId: number;
    chainIds?: ChainId[];
    cancelUrl: string;
    successUrl: string;
    expiresAt?: Date;
}

export interface ICheckoutSessionResponse {
    id: string;
    url: string;
}
