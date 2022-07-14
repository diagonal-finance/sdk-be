import { DiagonalError } from "src/error";

class NoErrorThrownError extends Error {}

export async function getOperationError(
    call: () => unknown
): Promise<DiagonalError> {
    try {
        await call();
        throw new NoErrorThrownError();
    } catch (error) {
        return error as DiagonalError;
    }
}
