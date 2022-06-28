export class DiagonalError implements Error {
    name = "DiagonalError";

    constructor(public message: string) {
        this.message = message;
    }
}
