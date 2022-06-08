export class Config {
    private _apiKey!: string;
    private _apiUrl = "https://api.diagonal.finance/graphql";

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
}

export const config = new Config();
