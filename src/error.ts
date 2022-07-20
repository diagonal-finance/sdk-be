export enum ErrorType {
    InvalidRequest = "InvalidRequestError",
    InvalidSignature = "InvalidSignatureError",
    Authentication = "AuthenticationError",
    Permission = "PermissionError",
    RateLimit = "RateLimitError",
    InternalService = "InternalServiceError",
}

export class DiagonalError extends Error {
    override name = "DiagonalError";

    public type = ErrorType.InternalService;

    constructor(message: string, public requestId?: string) {
        super(message);
        Object.setPrototypeOf(this, DiagonalError.prototype);
    }
}
