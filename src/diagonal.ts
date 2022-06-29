import { getGraphQLClient, GraphQLClient } from "./graphql/client";
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

    private graphQLClient: GraphQLClient;

    constructor(apiKey: string, apiUrl?: string) {
        this.graphQLClient = getGraphQLClient(apiKey, apiUrl);
        this.checkout = new Checkout(this.graphQLClient);
        this.portal = new Portal(this.graphQLClient);
    }
}
