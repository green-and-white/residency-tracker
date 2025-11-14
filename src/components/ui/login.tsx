// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Spinner } from "./spinner";
// import { createLoginCode } from "@/services/loginCodeService";
import supabase from "@/utils/supabase";

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
    
    // try {
    //     await createLoginCode()
    //     navigate('/entercode', { replace: true })
    // } catch (err) {
    //     console.error(err)
    //     alert('Failed to generate login code')
    //     setIsLoading(false)
    // }
  } 
  
  return (
    <button onClick={handleClick} className='border-2 w-full mb-8 rounded-xl px-6 py-2 cursor-pointer hover:bg-gray-100 transition flex justify-center items-center'>
      {isLoading ? <Spinner className="h-5 w-5 text-gray-600" /> : 'Log in'}
    </button>

  );
}