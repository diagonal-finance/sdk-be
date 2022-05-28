import fetch from 'cross-fetch'
import { config } from './config';
import { CREATE_CHECKOUT_SESSION_MUTATION } from './graphql/mutations';
import { ICheckoutSession } from "./interfaces/ICheckoutSession";
import { ICheckoutSessionInput, ICheckoutSessionResponse } from "./types";

/**
 * Class for interacting with Diagonal checkout sessions
 */
export default class CheckoutSession implements ICheckoutSession {

    constructor(private apiKey: string) {}

    public async create(checkoutSessionInput: ICheckoutSessionInput) : Promise <ICheckoutSessionResponse> {

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
        return checkoutSessionResponse.data.checkoutSessionCreate;

    }

}
