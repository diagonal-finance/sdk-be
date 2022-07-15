import { getGraphQLClient } from "./graphql/client";
import { IDiagonal, IPortal } from "./interfaces";
import { ICheckout } from "./interfaces/ICheckout";
import Checkout from "./modules/checkout/checkout";
import Portal from "./modules/portal/portal";

/**
 * Diagonal is the main class for interacting with the Diagonal backend SDK.
 */
export default class Diagonal implements IDiagonal {
    public checkout: ICheckout;
    public portal: IPortal;

    constructor(apiKey: string, apiUrl?: string) {
        const graphQLClient = getGraphQLClient(apiKey, apiUrl);
        this.checkout = new Checkout(graphQLClient);
        this.portal = new Portal(graphQLClient);
    }
}
