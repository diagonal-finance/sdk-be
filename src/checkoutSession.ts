import fetch from 'cross-fetch'
import { config } from './config';
import { ApiKeyNotProvidedError, CheckoutSessionApiError, CheckoutSessionCreateError, CheckoutSessionInvalidInputError, UnauthorizedError } from './error';
import { CREATE_CHECKOUT_SESSION_MUTATION } from './graphql/mutations';
import { ICheckoutSession } from "./interfaces/ICheckoutSession";
import { ICheckoutSessionInput, ICheckoutSessionResponse } from "./types";

/**
 * Class for interacting with Diagonal checkout sessions
 */
export default class CheckoutSession implements ICheckoutSession {

    constructor(private apiKey: string) {}

    public async create(checkoutSessionInput: ICheckoutSessionInput) : Promise <ICheckoutSessionResponse> {

        if(!this.apiKey || this.apiKey === '') throw new ApiKeyNotProvidedError('API key not provided');

        this.verifyCheckoutSessionInput(checkoutSessionInput);

            const response = await fetch(config.diagonalBackendUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "x-api-key":  this.apiKey
                },
                body: JSON.stringify({
                    query: CREATE_CHECKOUT_SESSION_MUTATION,
                    variables: { checkoutSessionInput: checkoutSessionInput },
                }),
            });

            const checkoutSessionResponse = await response.json()

            if(checkoutSessionResponse.errors && checkoutSessionResponse.errors.length > 0 ) {
                let error = checkoutSessionResponse.errors[0];
                if(error.extensions.code === "UNAUTHORIZED") {
                    throw new UnauthorizedError('Unathorized request to create checkout session.')
                } else {
                    throw new CheckoutSessionApiError('API error while createing checkout session')
                }
            }

            return checkoutSessionResponse.data.checkoutSessionCreate;

       

    }

    private verifyCheckoutSessionInput(checkoutSessionInput: ICheckoutSessionInput): void {
        // TODO: do validaton

        throw new CheckoutSessionInvalidInputError('Invalid input');
    }

}
