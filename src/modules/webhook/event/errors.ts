import { DiagonalError } from "src/error";

class InvalidSignatureHeaderError extends DiagonalError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidSignatureHeaderError.prototype);
    }
}
class InvalidPayloadError extends DiagonalError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidPayloadError.prototype);
    }
}

class InvalidEndpointSecretError extends DiagonalError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidEndpointSecretError.prototype);
    }
}
class InvalidSignatureError extends DiagonalError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidSignatureError.prototype);
    }
}

export {
    InvalidSignatureHeaderError,
    InvalidPayloadError,
    InvalidEndpointSecretError,
    InvalidSignatureError,
};
