import { GraphQLClient } from "../../graphql/client";
import { ICheckoutSessions } from "../../interfaces";
import { ICheckout } from "../../interfaces/ICheckout";

import Sessions from "./session/sessions";

/**
 * Class for interacting with Diagonal checkout
 */
export default class Checkout implements ICheckout {
    public sessions: ICheckoutSessions;

    constructor(client: GraphQLClient) {
        this.sessions = new Sessions(client);
    }
}
