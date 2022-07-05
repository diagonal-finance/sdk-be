import { ChainId } from "src/config/chains";

export interface ICreatePortalSessionInput {
    customerId: string;
    returnUrl: URL;
    configuration?: {
        availablePackagesById?: string[];
        allowedChains?: ChainId[];
    };
}

export interface IPortalSession {
    id: string;
    url: string;
}
