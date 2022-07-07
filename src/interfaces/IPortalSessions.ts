import {
    ICreatePortalSessionInput,
    IPortalSession,
} from "../modules/portal/session/types";

export interface IPortalSessions {
    create(input: ICreatePortalSessionInput): Promise<IPortalSession>;
}
