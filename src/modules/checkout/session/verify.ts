import {
    ChainZod,
    PackageIdZod,
    reportErrorFromIssues,
    UrlZod,
} from "src/utils/zod";
import { z } from "zod";

import { InputError } from "./errors";
import { ICreateCheckoutSessionInput } from "./types";

const ONE_HOUR_MS = 3600 * 1000;

const CheckoutSessionInput: z.ZodType<ICreateCheckoutSessionInput> = z.object({
    customerId: z.string(),
    packageId: PackageIdZod,
    allowedChains: z.optional(ChainZod.array()),
    optimisticRedirect: z.optional(z.boolean()),
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
    input: ICreateCheckoutSessionInput
): void {
    const result = CheckoutSessionInput.safeParse(input);
    if (result.success) return;

    reportErrorFromIssues(InputError, result.error.issues);
}
