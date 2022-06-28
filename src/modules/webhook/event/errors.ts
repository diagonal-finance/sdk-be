import { DiagonalError } from "../../../error";

class InvalidSignatureHeaderError extends DiagonalError {}
class InvalidPayloadError extends DiagonalError {}
class InvalidEndpointSecretError extends DiagonalError {}
class InvalidSignatureError extends DiagonalError {}

export {
    InvalidSignatureHeaderError,
    InvalidPayloadError,
    InvalidEndpointSecretError,
    InvalidSignatureError,
};
