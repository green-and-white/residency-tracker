import { createContext, useContext } from "react";
import type { Session } from "@supabase/supabase-js";

export const SessionContext = createContext<Session | null >(null);

export default function useSession() {
  return useContext(SessionContext);
}
