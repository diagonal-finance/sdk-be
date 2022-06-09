export class Config {
    private _apiKey!: string;
    private _apiUrl = "https://api.diagonal.finance/graphql";
    private _checkoutUrl = "https://checkout.diagonal.finance/";

    get apiKey(): string {
        return this._apiKey;
    }

    set apiKey(newApiKey: string) {
        this._apiKey = newApiKey;
    }

    get apiUrl(): string {
        return this._apiUrl;
    }

    set apiUrl(newApiUrl: string) {
        this._apiUrl = newApiUrl;
    }

    get checkoutUrl(): string {
        return this._checkoutUrl;
    }

    set checkoutUrl(newCheckoutUrl: string) {
        this._checkoutUrl = newCheckoutUrl;
    }
}

export const config = new Config();
