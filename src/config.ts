export class Config {
    private _apiKey!: string;
    private _apiUrl = "https://api.diagonal.finance/graphql";
    private _checkoutBaseUrl = "https://checkout.diagonal.finance";

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

    get checkoutBaseUrl(): string {
        return this._checkoutBaseUrl;
    }
}

export const config = new Config();
