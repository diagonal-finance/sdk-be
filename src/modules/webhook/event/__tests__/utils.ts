import { ChainId } from "../../../../config/chains";
import { Token } from "../../../../config/tokens";
import { Event, IWebhookEvent } from "../types";

export const testConfig: {
    subscriptionPayload: IWebhookEvent,
    signatureHeader: string,
    invalidSignatureHeaders: string[],
    endpointSecret: string
} = {
    subscriptionPayload: {
        customerId: '47adab7fd1f0121d91446563f',
        customerAddress: "0x4Ea66bE6947D711Ed963fc4aa8c04c5a4da6959B",
        serviceAddress: "0x245312DBb10B1eada0d4E597bDe17134845Bd787",
        token: Token.DAI,
        packageId: 1,
        chainId: ChainId.Mumbai,
        event: Event.SUBSCRIPTION_ACKNOWLEDGED,
    },
    signatureHeader:
        "t=1647115932683,v0=bd7ed90021cec7803f9074de5fbef32416bc5565ac291f8ebcecc9a9fc0bfd61",
    invalidSignatureHeaders: [
        "",
        "t=1647115932683",
        "v0=c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
        "1647115932683",
        "c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
        "t1647115932683,v0=c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
        "t=1647115932683,v0c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
        "1647115932683,c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
        "t=16471159326,v0=c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962cced",
    ],
    endpointSecret:
        "788284448d0ffabed8b47e6ed1848de4b7522257f6b516a7cc75e6da15905cb1",
};
