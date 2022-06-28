import { getGraphQLClient, GraphQLClient } from "./graphql/client";
import { IDiagonal } from "./interfaces";
import { ICheckoutSession } from "./interfaces/ICheckoutSession";
import CheckoutSession from "./modules/checkout/session";

/**
 * Diagonal is the main class for interacting with the Diagonal backend SDK.
 */
export default class Diagonal implements IDiagonal {
    public checkoutSession: ICheckoutSession;

    private graphQLClient: GraphQLClient;

    constructor(apiKey: string, apiUrl?: string) {
        this.graphQLClient = getGraphQLClient(apiKey, apiUrl);
        this.checkoutSession = new CheckoutSession(this.graphQLClient);
    }
}
