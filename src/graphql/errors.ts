import { DiagonalError } from "../error";

class AuthenticationError extends DiagonalError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}
class InvalidInputError extends DiagonalError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidInputError.prototype);
    }
}
class InternalServiceError extends DiagonalError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InternalServiceError.prototype);
    }
}

export { AuthenticationError, InvalidInputError, InternalServiceError };
