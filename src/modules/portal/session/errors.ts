import { DiagonalError } from "src/error";

class CreatePortalSessionInputError extends DiagonalError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CreatePortalSessionInputError.prototype);
    }
}

class CreatePortalSessionExecutionError extends DiagonalError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(
            this,
            CreatePortalSessionExecutionError.prototype
        );
    }
}

export { CreatePortalSessionInputError, CreatePortalSessionExecutionError };
