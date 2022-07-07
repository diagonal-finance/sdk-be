import { GraphQLClient } from "src/graphql/client";
import { CreatePortalSessionMutation } from "src/graphql/schema.generated";
import { IPortalSessions } from "src/interfaces";

import { CreatePortalSessionExecutionError } from "./errors";
import { ICreatePortalSessionInput, IPortalSession } from "./types";
import { verifyPortalSessionInput } from "./verify";

/**
 * Class for interacting with Diagonal checkout sessions
 */
export default class Sessions implements IPortalSessions {
    constructor(private client: GraphQLClient) {}

    public async create(
        input: ICreatePortalSessionInput
    ): Promise<IPortalSession> {
        verifyPortalSessionInput(input);

        const response = await this.client.CreatePortalSession({
            input: {
                customerId: input.customerId,
                returnUrl: input.returnUrl,
                configuration: input.configuration,
            },
        });

        if (
            response.createPortalSession.__typename !==
            "CreatePortalSessionPayload"
        ) {
            return this.handleCreatePortalSessionError(response);
        }

        return response.createPortalSession.portalSession;
    }

    private handleCreatePortalSessionError(
        operation: CreatePortalSessionMutation
    ): never {
        const typename = operation.createPortalSession.__typename;
        switch (typename) {
            case "CreatePortalSessionCustomerNotFoundError":
            case "CreatePortalSessionPackagesNotFoundError":
            case "CreatePortalSessionServiceNotInChainError":
                throw new CreatePortalSessionExecutionError(
                    operation.createPortalSession.message
                );
            default:
                throw new CreatePortalSessionExecutionError(
                    "Unknown error occurred during checkout session creation"
                );
        }
    }
}
