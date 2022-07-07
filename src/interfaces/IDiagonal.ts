import { ICheckout } from "./ICheckout";
import { IPortal } from "./IPortal";

export interface IDiagonal {
    get checkout(): ICheckout;
    get portal(): IPortal;
}
