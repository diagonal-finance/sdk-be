class DiagonalError implements Error {
    name = "DiagonalError";

    constructor(public message: string) {
        this.message = message;
    }
}

class UnauthorizedError extends DiagonalError {}
class InvalidInputError extends DiagonalError {}
class InternalServiceError extends DiagonalError {}

export {
    DiagonalError,
    UnauthorizedError,
    InvalidInputError,
    InternalServiceError,
};

export * from "./modules/webhook/event/errors";
export * from "./modules/checkout/errors";
