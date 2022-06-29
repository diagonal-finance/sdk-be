import { z } from "zod";

import { ChainZod, PackageIdZod, UrlZod } from "../../../utils/zod";

import { InvalidCheckoutSessionInputError } from "./errors";
import { ICheckoutSessionInput } from "./types";

const ONE_HOUR_MS = 3600 * 1000;

const CheckoutSessionInput: z.ZodType<ICheckoutSessionInput> = z.object({
    customerId: z.string(),
    packageId: PackageIdZod,
    chainIds: z.optional(ChainZod.array()),
    cancelUrl: UrlZod,
    successUrl: UrlZod,
    expiresAt: z.optional(
        z
            .date()
            .refine(
                (date) => date.getTime() >= Date.now() + ONE_HOUR_MS,
                "The date must be minimum 1 hour"
            )
            .and(
                z
                    .date()
                    .refine(
                        (date) =>
                            date.getTime() <= Date.now() + 24 * ONE_HOUR_MS
                    )
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
