import { GraphQLClient } from "../../../graphql/client";
import { ICheckoutSessions } from "../../../interfaces/ICheckoutSession";

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

        return response.checkoutSessionCreate;
    }
}
