class DiagonalError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class InvalidSignatureHeaderError extends DiagonalError {}

class InvalidPayloadError extends DiagonalError {}

class InvalidEndpointSecretError extends DiagonalError {}

class InvalidSignatureError extends DiagonalError {}

class UnauthorizedError extends DiagonalError {}

class ApiKeyNotProvidedError extends DiagonalError {}

class CheckoutSessionApiError extends DiagonalError {}

class InvalidCheckoutSessionInputError extends DiagonalError {}

class CheckoutSessionCreateError extends DiagonalError {}

export {
    InvalidSignatureHeaderError,
    InvalidPayloadError,
    InvalidEndpointSecretError,
    InvalidSignatureError,
    UnauthorizedError,
    ApiKeyNotProvidedError,
    CheckoutSessionApiError,
    InvalidCheckoutSessionInputError,
    CheckoutSessionCreateError
};
