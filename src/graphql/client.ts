import {
    ClientError,
    GraphQLClient as GraphQLClientRequest,
} from "graphql-request";

import {
    InternalServiceError,
    InvalidInputError,
    UnauthorizedError,
} from "./errors";
import { getSdk, SdkFunctionWrapper } from "./schema.generated";

export type GraphQLClient = ReturnType<typeof getSdk>;

const apiUrl = "https://api.diagonal.finance/graphql";

function handleClientError(error: ClientError) {
    const response = error.response;
    if (response.errors && response.errors.length > 0) {
        const isAuthError = response.errors.find(
            (responseError) => responseError.extensions.code === "UNAUTHORIZED"
        );
        if (isAuthError) {
            throw new UnauthorizedError("Authorization error");
        }
        const isBadInputError = response.errors.find(
            (responseError) =>
                responseError.extensions.code === "BAD_USER_INPUT"
        );
        if (isBadInputError) {
            throw new InvalidInputError("Invalid input value provided");
        }
    }
}

const wrapper: SdkFunctionWrapper = async (action) => {
    try {
        return await action();
    } catch (error) {
        if (error instanceof ClientError) {
            handleClientError(error);
        }
    }
    throw new InternalServiceError(
        `Internal service error while executing operation`
    );
};

export const getGraphQLClient = (
    apiKey: string,
    url?: string
): GraphQLClient => {
    return getSdk(
        new GraphQLClientRequest(url ?? apiUrl, {
            headers: {
                "x-api-key": apiKey,
            },
        }),
        wrapper
    );
};
