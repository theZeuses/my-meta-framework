import { BearerToken, RefreshToken } from "@modules/auth/interfaces";

declare global {
   /*~ Here, declare things that go in the global namespace, or augment
   *~ existing declarations in the global namespace
   */
   type valueof<T> = T[keyof T];
   type StringValueOf<T> = T[keyof T] & string;
   type Newable<T> = new (...args: any[]) => T;
   type PartialPartial<T, K extends keyof T> = Partial<Pick<T,K>> & Omit<T, K>
   declare namespace Express {
      export interface Request {
         user?: BearerToken,
         userWhileRefreshToken?: RefreshToken,
      }
   }
}
export {}