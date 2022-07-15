import {
    ClientError,
    GraphQLClient as GraphQLClientRequest,
} from "graphql-request";
import { DiagonalError } from "src/error";

import {
    AuthenticationError,
    InvalidInputError,
    PermissionError,
} from "./errors";
import { getSdk, SdkFunctionWrapper } from "./schema.generated";

export type GraphQLClient = ReturnType<typeof getSdk>;

const DEFAULT_API_URL = "https://api.diagonal.finance/graphql";

function handleClientError(error: ClientError) {
    const response = error.response;
    if (response.errors && response.errors.length > 0) {
        const isAuthError = response.errors.find(
            (responseError) => responseError.extensions.code === "UNAUTHORIZED"
        );
        if (isAuthError) {
            throw new AuthenticationError(
                "Unable to authenticate with API key provided"
            );
        }
        const isPermissionError = response.errors.find(
            (responseError) => responseError.extensions.code === "PERMISSION"
        );
        if (isPermissionError) {
            throw new PermissionError(isPermissionError.message);
        }
        const isBadInputError = response.errors.find(
            (responseError) =>
                responseError.extensions.code === "BAD_USER_INPUT"
        );
        if (isBadInputError) {
            const path = isBadInputError.path?.map((string) => string + ".");
            throw new InvalidInputError(
                `Invalid input value provided at ${path}`
            );
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
    throw new DiagonalError(`Error while executing operation`);
};

export const getGraphQLClient = (
    apiKey: string,
    url?: string
): GraphQLClient => {
    if (typeof apiKey !== "string") {
        throw new AuthenticationError("API key not provided");
    }
    return getSdk(
        new GraphQLClientRequest(url ?? DEFAULT_API_URL, {
            headers: {
                "x-api-key": apiKey,
            },
        }),
        wrapper
    );
};
