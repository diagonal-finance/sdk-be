import { DiagonalError, ErrorType } from "src/error";

class InputError extends DiagonalError {
    override type = ErrorType.InvalidRequest;
}

class PackageNotFoundError extends DiagonalError {
    override type = ErrorType.InvalidRequest;
}

export { PackageNotFoundError, InputError };
