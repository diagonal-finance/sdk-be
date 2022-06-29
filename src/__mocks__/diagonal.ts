import { graphQLClient } from "../graphql/__mocks__/client";
import { ICheckout } from "../interfaces";
import Checkout from "../modules/checkout/checkout";

jest.mock("../graphql/client");

export default class Diagonal {
    get checkout(): ICheckout {
        return new Checkout(graphQLClient);
    }
}
