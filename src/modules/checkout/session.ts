import { GraphQLClient } from "../../graphql/client";
import { ICheckoutSession } from "../../interfaces/ICheckoutSession";

import { ICheckoutSessionInput, ICheckoutSessionResponse } from "./types";
import { verifyCheckoutSessionInput } from "./verify";

/**
 * Class for interacting with Diagonal checkout sessions
 */
export default class CheckoutSession implements ICheckoutSession {
    constructor(private graphQLClient: GraphQLClient) {}

    public async create(
        checkoutSessionInput: ICheckoutSessionInput
    ): Promise<ICheckoutSessionResponse> {
        verifyCheckoutSessionInput(checkoutSessionInput);

        const response = await this.graphQLClient.CheckoutSessionCreate({
            input: checkoutSessionInput,
        });

        return response.checkoutSessionCreate;
    }
}
