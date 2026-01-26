import supabase from "@/utils/supabase";
import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { Spinner } from "./spinner";
import { SessionContext } from "@/hooks/useSession";
import { fetchStudentAuthByEmail } from "@/services/checkStudentService";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react"
import { useNavigate } from "react-router-dom";

export function LogoutButton() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const adminPassword = import.meta.env.VITE_APP_PASSWORD;

  const handleClick = async () => {
    setError(false);
    setIsLoading(true);
    if (password === adminPassword) {
      setPassword(""); 
      await supabase.auth.signOut();
    } else {
      setError(true);
      setIsLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    
    if (error) {
      setError(false);
    } 
  }

  // modifed from radix-ui dialog docs!
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className='border w-full mb-8 rounded-md px-6 py-2 cursor-pointer hover:bg-gray-300 transition flex justify-center items-center bg-gray-100 font-normal'>
          End Session
        </button>
      </Dialog.Trigger>
      <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-overlayShow" />
      <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-(--shadow-6) focus:outline-none data-[state=open]:animate-contentShow">
        <Dialog.Title className="m-0 text-[17px] font-medium text-gray-900">
          End session?
        </Dialog.Title>
        <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-gray-600">
          Enter admin password to end today's residency session:
        </Dialog.Description>
        <fieldset className="mb-[15px] flex items-center">
          <input
            type="password"
            value={password}
            className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-gray-700 shadow-[0_0_0_1px] shadow-gray-300 outline-none focus:shadow-[0_0_0_2px] focus:shadow-blue-500"
            onChange={handleChange} 
          />
        </fieldset>
        <div className="mt-[25px] flex justify-end"> 
          <div className="flex flex-col gap-2 items-end">
            <button 
              // disable the button if there is no input
              onClick={handleClick}
              disabled={!password}
              className={`inline-flex h-[35px] items-center justify-center rounded px-[15px] font-medium leading-none outline-none outline-offset-1 focus-visible:outline-2 select-none ${
                !password 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-green-100 text-green-700 hover:bg-green-200 focus-visible:outline-green-500 cursor-pointer"
                }`}
            >
              {isLoading ? <Spinner className="h-5 w-5 text-gray-600" /> : "End session"}
            </button>
          
            {error && <p className="text-xs text-red-600">*Incorrect admin password</p>} 
          </div> 
        </div>
        <Dialog.Close asChild>
          <button
            className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 focus:shadow-[0_0_0_2px] focus:shadow-blue-500 focus:outline-none"
            aria-label="Close"
            onClick={()=>{setError(false); setPassword("")}}
          >
            <X />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleClick = async () => {
    setIsLoading(true)
    navigate("/residency")
  } 
  
  return (
    <button onClick={handleClick} className='bg-black text-white border-2 w-68 mb-8 rounded-xl px-6 py-2 cursor-pointer hover:bg-zinc-700 transition flex justify-center items-center'>
      {isLoading ? <Spinner className="h-5 w-5 text-gray-600" /> : "Start Residency Session"}
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