import { DiagonalError, ErrorType } from "src/error";

class InputError extends DiagonalError {
    override type = ErrorType.InvalidRequest;
}

class ExecutionError extends DiagonalError {
    override type = ErrorType.InternalService;
}

export { InputError, ExecutionError };
