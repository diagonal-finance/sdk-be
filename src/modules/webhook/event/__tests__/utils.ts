import { ChainId } from "src/config/chains";
import { Token } from "src/config/tokens";

import { EventType, IWebhookEvent } from "../types";

const timestamp = Date.now();

export const testConfig: {
    subscriptionPayload: IWebhookEvent;
    signatureHeader: string;
    endpointSecret: string;
    timestamp: number;
} = {
    subscriptionPayload: {
        customerId: "47adab7fd1f0121d91446563f",
        customerAddress: "0x4Ea66bE6947D711Ed963fc4aa8c04c5a4da6959B",
        serviceId: "957cebc5-d66d-45fd-bbef-0a5ee90287cf",
        token: Token.DAI,
        packageId: "4cca4f06-ba41-4e99-b3ba-a7382ca82d6f",
        chainId: ChainId.Mumbai,
        type: EventType.SubscriptionAcknowledged,
    },
    signatureHeader: `t=${timestamp},v0=8b0bb0b96db63f3f95dc4c40ac7f503680e00f33a52a184bec11a79788df3419`,
    endpointSecret:
        "788284448d0ffabed8b47e6ed1848de4b7522257f6b516a7cc75e6da15905cb1",
    timestamp,
};
