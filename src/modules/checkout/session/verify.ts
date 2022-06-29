import {
    ChainZod,
    PackageIdZod,
    reportErrorFromIssues,
    UrlZod,
} from "src/utils/zod";
import { z } from "zod";

import { CreateCheckoutSessionInputError } from "./errors";
import { ICreateCheckoutSessionInput } from "./types";

const ONE_HOUR_MS = 3600 * 1000;

const CheckoutSessionInput: z.ZodType<ICreateCheckoutSessionInput> = z.object({
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
    input: ICreateCheckoutSessionInput
): void {
    const result = CheckoutSessionInput.safeParse(input);
    if (result.success) return;

    reportErrorFromIssues(CreateCheckoutSessionInputError, result.error.issues);
}
