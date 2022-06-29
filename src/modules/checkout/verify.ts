import { z } from "zod";

import { ChainZod, PackageIdZod, UrlZod } from "../../utils/zod";

import { InvalidCheckoutSessionInputError } from "./errors";
import { ICheckoutSessionInput } from "./types";

const CheckoutSessionInput: z.ZodType<ICheckoutSessionInput> = z.object({
    customerId: z.string(),
    packageId: PackageIdZod,
    chainIds: z.optional(ChainZod.array()),
    cancelUrl: UrlZod,
    successUrl: UrlZod,
    expiresAt: z.optional(
        z
            .date()
            .refine((date) => {
                return date > new Date(Date.now());
            }, "The date must be before today")
            .and(
                z.date().refine((date) => {
                    return date > new Date(Date.now() + 25 * 60 * 60 * 1000);
                })
            )
    ),
});

export function verifyCheckoutSessionInput(
    checkoutSessionInput: ICheckoutSessionInput
): void {
    const result = CheckoutSessionInput.safeParse(checkoutSessionInput);
    if (result.success) return;

    const issues = result.error.issues;

    for (const issue of issues) {
        const path = issue.path.reduce((prev, value) => prev + "," + value);
        throw new InvalidCheckoutSessionInputError(
            `Invalid payload. ${issue.message} \`${path}\` field.`
        );
    }
}
