import { GraphQLClient } from "../../../graphql/client";
import { CheckoutSessionCreateMutation } from "../../../graphql/schema.generated";
import { ICheckoutSessions } from "../../../interfaces/ICheckoutSession";

import { CheckoutSessionCreateError } from "./errors";
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

        const response = await this.client.CheckoutSessionCreate({
            input: checkoutSessionInput,
        });

        if (response.checkoutSessionCreate.__typename !== "CheckoutSession") {
            return this.handleCheckoutSessionCreateError(response);
        }

        return response.checkoutSessionCreate;
    }

    private handleCheckoutSessionCreateError(
        operation: CheckoutSessionCreateMutation
    ): never {
        switch (operation.checkoutSessionCreate.__typename) {
            case "PackageNotFound":
            case "InvalidExpiresAt":
                throw new CheckoutSessionCreateError(
                    operation.checkoutSessionCreate.message
                );
            default:
                throw new CheckoutSessionCreateError(
                    "Unknown error occurred during checkout session creation"
                );
        }
    }
}
