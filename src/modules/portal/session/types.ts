import { ChainId } from "src/config/chains";

export interface ICreatePortalSessionInput {
    customerId: string;
    returnUrl: URL;
    configuration?: {
        availablePackages?: string[];
        availableChains?: ChainId[];
    };
}

export interface IPortalSession {
    id: string;
    url: string;
}
