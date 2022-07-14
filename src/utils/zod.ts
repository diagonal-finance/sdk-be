import { ChainId } from "src/config/chains";
import { Token } from "src/config/tokens";
import { DiagonalError } from "src/error";
import { z } from "zod";

export const TokenZod = z.nativeEnum(Token);
export const ChainZod = z.nativeEnum(ChainId);
export const EthereumAddressZod = z.string().regex(/^(0x)?[0-9a-fA-F]{40}$/);
export const PackageIdZod = z.string().uuid();
export const ServiceIdZod = z.string().uuid();
export const UrlZod = z.instanceof(URL);

export function reportErrorFromIssues(
    ErrorClass: typeof DiagonalError,
    issues: z.ZodIssue[]
): void {
    if (issues.length === 0) throw new ErrorClass("Input validation failed");

    for (const issue of issues) {
        const path = issue.path.reduce((prev, value) => prev + "." + value);
        throw new ErrorClass(
            `Invalid payload. ${issue.message} in \`${path}\` field.`
        );
    }
}
