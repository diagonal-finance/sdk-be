import { ChainId } from "src/config/chains";

interface ICreatePortalSessionInputPackageConfig {
    packageId: string;
    chainId: ChainId;
}

export interface ICreatePortalSessionInput {
    customerId: string;
    returnUrl: URL;
    configuration?: {
        availablePackages?: ICreatePortalSessionInputPackageConfig[];
        allowedChains?: ChainId[];
    };
}

export interface IPortalSession {
    id: string;
    url: string;
}
