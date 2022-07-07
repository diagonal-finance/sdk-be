import { DiagonalError } from "src/error";

class CreateCheckoutSessionInputError extends DiagonalError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CreateCheckoutSessionInputError.prototype);
    }
}

class CreateCheckoutSessionExecutionError extends DiagonalError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(
            this,
            CreateCheckoutSessionExecutionError.prototype
        );
    }
}

export { CreateCheckoutSessionExecutionError, CreateCheckoutSessionInputError };
