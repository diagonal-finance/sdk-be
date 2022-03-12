import { SubscriptionEventType } from "../types";

import { supportedChainIds } from "./consts";

export const isValidAddress = (address: string): boolean => {
    if (typeof address !== "string") return false;

    if (!address.match(/^(0x)?[0-9a-fA-F]{40}$/)) return false;

    if (address.substring(0, 2) !== "0x") return false;

    // TODO: Check if it is a checksum address?

    return true;
};

export const isValidFlowRate = (flowRate: number): boolean => {
    if (typeof flowRate !== "number") return false;
    if (flowRate < 0) return false;
    return true;
};

export const isValidEventType = (eventType: string): boolean => {
    if (typeof eventType !== "string") return false;

    if (eventType === "") return false;

    if (
        !Object.values(SubscriptionEventType)
            .map((entity) => entity.toString())
            .includes(eventType)
    )
        return false;

    return true;
};

export const isValidChainId = (chainId: number): boolean => {
    if (typeof chainId !== "number") return false;

    if (!supportedChainIds.includes(chainId)) return false;

    return true;
};

export const signatureHeaderElementsValid = (
    signatureHeaderElements: string[]
): boolean => {
    try {
        if (typeof signatureHeaderElements !== "object") return false;

        if (!(signatureHeaderElements.length === 2)) return false;
        if (typeof signatureHeaderElements[0] !== "string") return false;
        if (typeof signatureHeaderElements[1] !== "string") return false;

        const timestampFields = signatureHeaderElements[0].split("=");
        const signatureFields = signatureHeaderElements[1].split("=");
        if (timestampFields[0] !== "t") return false;
        if (signatureFields[0] !== "v0") return false;

        if (timestampFields[1]?.length !== 13) return false;
        if (signatureFields[1]?.length !== 64) return false;

        return true;
    } catch (e) {
        return false;
    }
};
