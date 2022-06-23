import fetch from "cross-fetch";

import { config } from "./config";
import {
    ApiKeyNotProvidedError,
    CheckoutSessionApiError,
    InvalidCheckoutSessionInputError,
    UnauthorizedError,
} from "./error";
import { CREATE_CHECKOUT_SESSION_MUTATION } from "./graphql/mutations";
import { ICheckoutSession } from "./interfaces/ICheckoutSession";
import { ICheckoutSessionInput, ICheckoutSessionResponse } from "./types";
import {
    isValidAddress,
    isValidChainId,
    isValidExpiresAt,
    isValidUrl,
} from "./utils";

/**
 * Class for interacting with Diagonal checkout sessions
 */
export default class CheckoutSession implements ICheckoutSession {
    public async create(
        checkoutSessionInput: ICheckoutSessionInput
    ): Promise<ICheckoutSessionResponse> {
        if (!config.apiKey || config.apiKey === "")
            throw new ApiKeyNotProvidedError("API key not provided");

        this.verifyCheckoutSessionInput(checkoutSessionInput);

        const response = await fetch(config.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "x-api-key": config.apiKey,
            },
            body: JSON.stringify({
                query: CREATE_CHECKOUT_SESSION_MUTATION,
                variables: { checkoutSessionInput: checkoutSessionInput },
            }),
        });

        const checkoutSessionResponseRaw = await response.json();

        if (
            checkoutSessionResponseRaw.errors &&
            checkoutSessionResponseRaw.errors.length > 0
        ) {
            const error = checkoutSessionResponseRaw.errors[0];
            if (error.extensions.code === "UNAUTHORIZED") {
                throw new UnauthorizedError(
                    "Unathorized request to create checkout session."
                );
            } else {
                let errorString: string;
                if (error?.extensions?.code && error?.extensions?.code !== "") {
                    errorString = `API error while creating checkout session: ${error?.extensions?.code}`;
                } else {
                    errorString = `API error while creating checkout session`;
                }
                throw new CheckoutSessionApiError(errorString);
            }
        }

        const checkoutSessionResponse: ICheckoutSessionResponse =
            checkoutSessionResponseRaw.data.checkoutSessionCreate;

        return {
            ...checkoutSessionResponse,
            checkoutUrl: `${config.checkoutBaseUrl}/${checkoutSessionResponse.uuid}`,
        };
    }

    private verifyCheckoutSessionInput(
        checkoutSessionInput: ICheckoutSessionInput
    ): void {
        if (!isValidAddress(checkoutSessionInput["serviceAddress"])) {
            throw new InvalidCheckoutSessionInputError(
                "Invalid checkout session input `serviceAddress` field."
            );
        }

        if (checkoutSessionInput["packageRegistryId"] <= 0) {
            throw new InvalidCheckoutSessionInputError(
                "Invalid checkout session input `packageRegistryId` field."
            );
        }

        if (!isValidChainId(checkoutSessionInput.chainId)) {
            throw new InvalidCheckoutSessionInputError(
                "Invalid checkout session input `chainId` field."
            );
        }

        if (!isValidUrl(checkoutSessionInput.cancelUrl)) {
            throw new InvalidCheckoutSessionInputError(
                "Invalid checkout session input `cancelUrl` field."
            );
        }

        if (!isValidUrl(checkoutSessionInput.successUrl)) {
            throw new InvalidCheckoutSessionInputError(
                "Invalid checkout session input `successUrl` field."
            );
        }

        const expiresAt = checkoutSessionInput["expiresAt"];

        if (expiresAt && !isValidExpiresAt(expiresAt)) {
            throw new InvalidCheckoutSessionInputError(
                "Invalid checkout session input `expiresAt` field."
            );
        }
    }
}
