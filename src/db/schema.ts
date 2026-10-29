export * from "./schemas/auth-schema";
export * from "./schemas/clinic-schema";

import * as auth from "./schemas/auth-schema";
import * as clinic from "./schemas/clinic-schema";

export const schemas = { ...auth, ...clinic } as const;
export type Schemas = typeof schemas;
