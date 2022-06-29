import { z } from "zod";

import { ChainId } from "../config/chains";
import { Token } from "../config/tokens";

export const TokenZod = z.nativeEnum(Token);
export const ChainZod = z.nativeEnum(ChainId);
export const EthereumAddressZod = z.string().regex(/^(0x)?[0-9a-fA-F]{40}$/);
export const PackageIdZod = z.number().gt(0);
