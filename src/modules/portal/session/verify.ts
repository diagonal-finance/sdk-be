import { z } from "zod";

import {
    ChainZod,
    PackageIdZod,
    reportErrorFromIssues,
    UrlZod,
} from "../../../utils/zod";

import { InputError } from "./errors";
import { ICreatePortalSessionInput } from "./types";

const PortalSessionInput: z.ZodType<ICreatePortalSessionInput> = z.object({
    customerId: z.string().min(1),
    returnUrl: UrlZod,
    configuration: z.optional(
        z.object({
            availableChains: z.optional(z.array(ChainZod)),
            availablePackages: z.optional(z.array(PackageIdZod)),
        })
    ),
});

export function verifyPortalSessionInput(
    input: ICreatePortalSessionInput
): void {
    const result = PortalSessionInput.safeParse(input);
    if (result.success) return;

    reportErrorFromIssues(InputError, result.error.issues);
}
