import CheckoutSession from "./checkoutSession";
import { ICheckoutSession } from "./interfaces/ICheckoutSession";
import { IWebhook } from "./interfaces/IWebhook";
import Webhook from "./webhook";


/**
 * Diagonal is the main class for interacting with the Diagonal backend SDK.
 */
export default class Diagonal {

    public webhook: IWebhook;
    public checkoutSession?: ICheckoutSession;

    constructor (apiKey?: string) {
        this.webhook = new Webhook()

        if(apiKey && apiKey !== '') {
            this.checkoutSession = new CheckoutSession(apiKey);
        }
    }

}