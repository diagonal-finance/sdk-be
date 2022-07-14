import { ChainId } from "src/config/chains";

export interface ICreatePortalSessionInputConfiguration {
    availablePackages?: string[];
    availableChains?: ChainId[];
}

export interface ICreatePortalSessionInput {
    customerId: string;
    returnUrl: URL;
    configuration?: ICreatePortalSessionInputConfiguration;
}

export interface IPortalSession {
    id: string;
    url: string;
}
