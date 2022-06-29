import { GraphQLClient } from "../../graphql/client";
import { IPortal } from "../../interfaces/IPortal";
import { IPortalSessions } from "../../interfaces/IPortalSessions";

import Sessions from "./session/sessions";

/**
 * Class for interacting with Diagonal checkout
 */
export default class Portal implements IPortal {
    public sessions: IPortalSessions;

    constructor(client: GraphQLClient) {
        this.sessions = new Sessions(client);
    }
}
