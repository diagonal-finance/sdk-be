import { GraphQLClient } from "src/graphql/client";
import { CreateCheckoutSessionMutation } from "src/graphql/schema.generated";
import { ICheckoutSessions } from "src/interfaces/ICheckoutSessions";

import { CreateCheckoutSessionExecutionError } from "./errors";
import { ICheckoutSession, ICreateCheckoutSessionInput } from "./types";
import { verifyCheckoutSessionInput } from "./verify";

/**
 * Class for interacting with Diagonal checkout sessions
 */
export default class Sessions implements ICheckoutSessions {
    constructor(private client: GraphQLClient) {}

    public async create(
        input: ICreateCheckoutSessionInput
    ): Promise<ICheckoutSession> {
        verifyCheckoutSessionInput(input);

        const response = await this.client.CreateCheckoutSession({
            input,
        });

        if (
            response.createCheckoutSession.__typename !==
            "CreateCheckoutSessionPayload"
        ) {
            return this.handleCreateCheckoutSessionError(response);
        }

        return response.createCheckoutSession.checkoutSession;
    }

    private handleCreateCheckoutSessionError(
        operation: CreateCheckoutSessionMutation
    ): never {
        switch (operation.createCheckoutSession.__typename) {
            case "CreateCheckoutSessionPackageNotFound":
            case "CreateCheckoutSessionInvalidExpiresAt":
                throw new CreateCheckoutSessionExecutionError(
                    operation.createCheckoutSession.message
                );
            default:
                throw new CreateCheckoutSessionExecutionError(
                    "Unknown error occurred during checkout session creation"
                );
        }
    }
}
