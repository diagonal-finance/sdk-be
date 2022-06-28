import { graphQLClient } from "../graphql/__mocks__/client"
import { ICheckoutSession } from "../interfaces"
import CheckoutSession from "../modules/checkout/session"

jest.mock("../graphql/client");

export default class Diagonal {
    get checkoutSession(): ICheckoutSession {
        return new CheckoutSession(graphQLClient)
    }
}
