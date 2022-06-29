import { GraphQLClient } from "../../../graphql/client";
import { CreateCheckoutSessionMutation } from "../../../graphql/schema.generated";
import { ICheckoutSessions } from "../../../interfaces/ICheckoutSession";

import { CreateCheckoutSessionError } from "./errors";
import { ICheckoutSessionInput, ICheckoutSessionResponse } from "./types";
import { verifyCheckoutSessionInput } from "./verify";

/**
 * Class for interacting with Diagonal checkout sessions
 */
export default class Sessions implements ICheckoutSessions {
    constructor(private client: GraphQLClient) {}

    public async create(
        checkoutSessionInput: ICheckoutSessionInput
    ): Promise<ICheckoutSessionResponse> {
        verifyCheckoutSessionInput(checkoutSessionInput);

        const response = await this.client.CreateCheckoutSession({
            input: checkoutSessionInput,
        });

        if (response.createCheckoutSession.__typename !== "CheckoutSession") {
            return this.handleCreateCheckoutSessionError(response);
        }

        return response.createCheckoutSession;
    }

    private handleCreateCheckoutSessionError(
        operation: CreateCheckoutSessionMutation
    ): never {
        switch (operation.createCheckoutSession.__typename) {
            case "PackageNotFound":
            case "InvalidExpiresAt":
                throw new CreateCheckoutSessionError(
                    operation.createCheckoutSession.message
                );
            default:
                throw new CreateCheckoutSessionError(
                    "Unknown error occurred during checkout session creation"
                );
        }
    }
}
