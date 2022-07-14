import { ChainId } from "src/config/chains";

export interface ICreateCheckoutSessionInput {
    customerId: string;
    packageId: string;
    cancelUrl: URL;
    successUrl: URL;

    expiresAt?: Date;
    allowedChains?: ChainId[];
    optimisticRedirect?: boolean;
}

export interface ICheckoutSession {
    id: string;
    url: URL;
}
