import { DiagonalError } from "../../../error";

class InvalidCheckoutSessionInputError extends DiagonalError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidCheckoutSessionInputError.prototype);
    }
}

class CreateCheckoutSessionError extends DiagonalError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CreateCheckoutSessionError.prototype);
    }
}

export { InvalidCheckoutSessionInputError, CreateCheckoutSessionError };
