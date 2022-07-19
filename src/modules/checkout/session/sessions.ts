import { DiagonalError } from "src/error";
import { GraphQLClient } from "src/graphql/client";
import { CreateCheckoutSessionMutation } from "src/graphql/schema.generated";
import { ICheckoutSessions } from "src/interfaces/ICheckoutSessions";

import { InputError, PackageNotFoundError } from "./errors";
import { ICheckoutSession, ICreateCheckoutSessionInput } from "./types";
import { verifyCheckoutSessionInput } from "./verify";

/**
 * Class for interacting with Diagonal checkout sessions
 */
export default class Sessions implements ICheckoutSessions {
    #client: GraphQLClient;

    constructor(client: GraphQLClient) {
        this.#client = client;
    }

    public async create(
        input: ICreateCheckoutSessionInput
    ): Promise<ICheckoutSession> {
        verifyCheckoutSessionInput(input);

        const response = await this.#client.CreateCheckoutSession({
            input,
        });

        if (
            response.data.createCheckoutSession.__typename !==
            "CreateCheckoutSessionPayload"
        ) {
            return this.handleCreateCheckoutSessionError(
                response.data,
                response.extensions?.requestId
            );
        }

        return response.data.createCheckoutSession.checkoutSession;
    }

    private handleCreateCheckoutSessionError(
        operation: CreateCheckoutSessionMutation,
        requestId: string | undefined
    ): never {
        switch (operation.createCheckoutSession.__typename) {
            case "CreateCheckoutSessionInvalidExpiresAtError":
                throw new InputError(
                    operation.createCheckoutSession.message,
                    requestId
                );
            case "CreateCheckoutSessionPackageNotFoundError":
                throw new PackageNotFoundError(
                    operation.createCheckoutSession.message,
                    requestId
                );
            default:
                throw new DiagonalError(
                    "Unknown error occurred during the creation of a checkout session",
                    requestId
                );
        }
    }
}
