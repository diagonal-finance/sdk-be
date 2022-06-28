import { DiagonalError } from "../../error";

class CheckoutSessionApiError extends DiagonalError {}
class InvalidCheckoutSessionInputError extends DiagonalError {}
class CheckoutSessionCreateError extends DiagonalError {}

export {
    CheckoutSessionApiError,
    InvalidCheckoutSessionInputError,
    CheckoutSessionCreateError,
};
