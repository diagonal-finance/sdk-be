import { Diagonal } from "..";
import CheckoutSession from "../modules/checkout/session";

// Checkout session class tests
describe("Diagonal tests", () => {
    it("Should be initialized correctly when apiKey is provided", () => {
        const apiKey = "abc";
        const diagonal = new Diagonal(apiKey);
        expect(diagonal.checkoutSession).toBeInstanceOf(CheckoutSession);
    });

    it("Should be initialized correctly when url is provided", () => {
        const apiKey = "abc";
        const apiUrl = "http://localhost:8080/graphql";
        const diagonal = new Diagonal(apiKey, apiUrl);
        expect(diagonal.checkoutSession).toBeInstanceOf(CheckoutSession);
    });
});
