import supabase from "@/utils/supabase";
import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { Spinner } from "./spinner";
import { SessionContext } from "@/hooks/useSession";
import { fetchStudentAuthByEmail } from "@/services/checkStudentService";

export function LoginButton() {
  // const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false) 

  const handleClick = async () => {
    setIsLoading(true)
   
    // Note: removed data since it is unused.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Error signing in with Google:', error);
    } 
    
  } 
  
  return (
    <button onClick={handleClick} className='border-2 w-full mb-8 rounded-xl px-6 py-2 cursor-pointer hover:bg-gray-100 transition flex justify-center items-center'>
      {isLoading ? <Spinner className="h-5 w-5 text-gray-600" /> : "Start today's residency session."}
    </button>

  );
}

export function SessionProvider({ children }: { children : React.ReactNode }) {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setCurrentSession(session));    

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentSession(session);
    });    

    return () => subscription.unsubscribe(); 

  }, []);

  useEffect(() => {
    async function checkAuthorization() {
      if (currentSession?.user.email) {
        const isStudentAuthorized = await fetchStudentAuthByEmail(currentSession?.user.email);
        
        if (!isStudentAuthorized) {
          console.log("Student is not authorized to start a session. Signing out."); // TODO: Change this into a pop-up.  
          await supabase.auth.signOut();
          setCurrentSession(null);
        }
      } 
    }
   
    checkAuthorization();
  }, [ currentSession ])

  if (!currentSession) {
    console.log("No session in progress."); // TODO: Turn this into a component/error page
  } 
  // else {
  //   console.log("LOGGED IN AS:", currentSession.user.email);
  // }

  return (
    <SessionContext.Provider value={currentSession}>
      { children }
    </SessionContext.Provider>
  );
}