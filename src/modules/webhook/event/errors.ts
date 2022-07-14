import { DiagonalError, ErrorType } from "src/error";

class InvalidSignatureHeaderError extends DiagonalError {
    override type = ErrorType.InvalidSignature;
}
class InvalidPayloadError extends DiagonalError {
    override type = ErrorType.InvalidSignature;
}

class InvalidEndpointSecretError extends DiagonalError {
    override type = ErrorType.InvalidSignature;
}
class InvalidSignatureError extends DiagonalError {
    override type = ErrorType.InvalidSignature;
}

export {
    InvalidSignatureHeaderError,
    InvalidPayloadError,
    InvalidEndpointSecretError,
    InvalidSignatureError,
};
