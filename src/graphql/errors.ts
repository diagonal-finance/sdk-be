import { DiagonalError, ErrorType } from "src/error";

class AuthenticationError extends DiagonalError {
    override type = ErrorType.Authentication;
}

class PermissionError extends DiagonalError {
    override type = ErrorType.Permission;
}

class InvalidInputError extends DiagonalError {
    override type = ErrorType.InvalidRequest;
}

export { AuthenticationError, InvalidInputError, PermissionError };
