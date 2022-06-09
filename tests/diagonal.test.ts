import { CheckoutSession, Diagonal, Webhook } from "../src";
import { config } from "../src/config";

// Checkout session class tests
describe("Diagonal tests", () => {
    beforeEach(() => {
        config.apiKey = undefined;
        config.apiUrl = "https://api.diagonal.finance/graphql";
    });

    it("Should be initialized correctly with no params", () => {
        const diagonal = new Diagonal();
        expect(config.apiKey).toBeUndefined();
        expect(config.apiUrl).toBe("https://api.diagonal.finance/graphql");
        expect(diagonal.checkoutSession).toBeInstanceOf(CheckoutSession);
        expect(diagonal.webhook).toBeInstanceOf(Webhook);
    });

    it("Should be initialized correctly when apiKey is provided", () => {
        const apiKey = "abc";
        const diagonal = new Diagonal(apiKey);
        expect(config.apiKey).toBe(apiKey);
        expect(config.apiUrl).toBe("https://api.diagonal.finance/graphql");
        expect(diagonal.checkoutSession).toBeInstanceOf(CheckoutSession);
        expect(diagonal.webhook).toBeInstanceOf(Webhook);
    });

    it("Should be initialized correctly when url is provided", () => {
        const apiKey = "abc";
        const apiUrl = "http://localhost:8080/graphql";
        const diagonal = new Diagonal(apiKey, apiUrl);
        expect(config.apiKey).toBe(apiKey);
        expect(config.apiUrl).toBe(apiUrl);
        expect(diagonal.checkoutSession).toBeInstanceOf(CheckoutSession);
        expect(diagonal.webhook).toBeInstanceOf(Webhook);
    });

    it("Api key should be set correctly", () => {
        const apiKey = "abc";
        const diagonal = new Diagonal();
        expect(config.apiKey).toBeUndefined();
        diagonal.setApiKey(apiKey);
        expect(config.apiKey).toBe(apiKey);
    });
});
