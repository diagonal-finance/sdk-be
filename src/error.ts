export class DiagonalError extends Error {
    override name = "DiagonalError";
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, DiagonalError.prototype);
    }
}
