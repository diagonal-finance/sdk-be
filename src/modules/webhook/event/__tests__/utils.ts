import { randomUUID } from "crypto";

import { ChainId } from "src/config/chains";
import { Token } from "src/config/tokens";

import { EventType, IWebhookEvent } from "../types";

export const testConfig: {
    subscriptionPayload: IWebhookEvent;
    signatureHeader: string;
    endpointSecret: string;
} = {
    subscriptionPayload: {
        customerId: "47adab7fd1f0121d91446563f",
        customerAddress: "0x4Ea66bE6947D711Ed963fc4aa8c04c5a4da6959B",
        serviceAddress: "0x245312DBb10B1eada0d4E597bDe17134845Bd787",
        token: Token.DAI,
        packageId: randomUUID(),
        chainId: ChainId.Mumbai,
        type: EventType.SubscriptionAcknowledged,
    },
    signatureHeader:
        "t=1647115932683,v0=d5e61f1872563b9020df79899f8f7ac2b3bb30f0d19a04540e6f15db0de5fd5d",
    endpointSecret:
        "788284448d0ffabed8b47e6ed1848de4b7522257f6b516a7cc75e6da15905cb1",
};
