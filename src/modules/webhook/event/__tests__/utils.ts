import { ChainId } from "../../../../config/chains";
import { Token } from "../../../../config/tokens";
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
        packageId: "1",
        chainId: ChainId.Mumbai,
        type: EventType.SubscriptionAcknowledged,
    },
    signatureHeader:
        "t=1647115932683,v0=dbd22857b1c4123494f875595185ba8d9b053464b4e1dcf62ec987b962d27a9b",
    endpointSecret:
        "788284448d0ffabed8b47e6ed1848de4b7522257f6b516a7cc75e6da15905cb1",
};
