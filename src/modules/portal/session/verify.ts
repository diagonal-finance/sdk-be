import { z } from "zod";

import {
    ChainZod,
    PackageIdZod,
    reportErrorFromIssues,
    UrlZod,
} from "../../../utils/zod";

import { CreatePortalSessionInputError } from "./errors";
import { ICreatePortalSessionInput } from "./types";

const PortalSessionInput: z.ZodType<ICreatePortalSessionInput> = z.object({
    customerId: z.string().min(1),
    returnUrl: UrlZod,
    configuration: z.optional(
        z.object({
            allowedChains: z.optional(z.array(ChainZod)),
            availablePackagesById: z.optional(z.array(PackageIdZod)),
        })
    ),
});

export function verifyPortalSessionInput(
    input: ICreatePortalSessionInput
): void {
    const result = PortalSessionInput.safeParse(input);
    if (result.success) return;

    reportErrorFromIssues(CreatePortalSessionInputError, result.error.issues);
}
