import CheckoutSession from "./checkoutSession";
import { config } from "./config";
import { ICheckoutSession } from "./interfaces/ICheckoutSession";
import { IWebhook } from "./interfaces/IWebhook";
import Webhook from "./webhook";

/**
 * Diagonal is the main class for interacting with the Diagonal backend SDK.
 */
export default class Diagonal {
    public webhook: IWebhook;
    public checkoutSession: ICheckoutSession;

    constructor(apiKey?: string, apiUrl?: string, checkoutUrl?: string) {
        this.webhook = new Webhook();
        this.checkoutSession = new CheckoutSession();

        if (apiKey) {
            config.apiKey = apiKey;
        }

        if (apiUrl) {
            config.apiUrl = apiUrl;
        }

        if (checkoutUrl) {
            config.checkoutUrl = checkoutUrl;
        }
    }

    public setApiKey = (apiKey: string) => {
        config.apiKey = apiKey;
    };
}
