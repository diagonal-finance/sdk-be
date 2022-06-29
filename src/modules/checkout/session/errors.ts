import { DiagonalError } from "../../../error";

class InvalidCheckoutSessionInputError extends DiagonalError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidCheckoutSessionInputError.prototype);
    }
}

class CheckoutSessionCreateError extends DiagonalError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CheckoutSessionCreateError.prototype);
    }
}

export { InvalidCheckoutSessionInputError, CheckoutSessionCreateError };
