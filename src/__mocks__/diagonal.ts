import { graphQLClient } from "src/graphql/__mocks__/client";
import { ICheckout, IPortal } from "src/interfaces";
import Checkout from "src/modules/checkout/checkout";
import Portal from "src/modules/portal/portal";

jest.mock("src/graphql/client");

export default class Diagonal {
    get checkout(): ICheckout {
        return new Checkout(graphQLClient);
    }
    get portal(): IPortal {
        return new Portal(graphQLClient);
    }
}
