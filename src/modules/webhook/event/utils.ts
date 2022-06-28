import { Event } from "./types";

export const isValidEventType = (eventType: string): boolean => {
    if (typeof eventType !== "string") return false;

    if (eventType === "") return false;

    if (
        !Object.values(Event)
            .map((entity) => entity.toString())
            .includes(eventType)
    )
        return false;

    return true;
};

export const signatureHeaderElementsValid = (
    signatureHeaderElements: string[]
): boolean => {
    try {
        if (typeof signatureHeaderElements !== "object") return false;

        if (signatureHeaderElements.length !== 2) return false;
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