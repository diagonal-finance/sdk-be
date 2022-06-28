import { DiagonalError } from "../error";

class UnauthorizedError extends DiagonalError {}
class InvalidInputError extends DiagonalError {}
class InternalServiceError extends DiagonalError {}

export { UnauthorizedError, InvalidInputError, InternalServiceError };
