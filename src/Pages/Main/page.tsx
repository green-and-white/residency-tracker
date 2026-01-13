import gwLogo from '@/assets/gw_logo.png'
import { Link } from 'react-router-dom'
import { LoginButton } from '@/components/ui/auth'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useSession from '@/hooks/useSession'

export default function Main() {
    const session = useSession();
    const navigate = useNavigate();   

    const today = new Date()
    
    const formattedDate = today.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    })

    useEffect(() => {
      if (session) {
        navigate("/residency", { replace: true });
      }
    }, [ session, navigate ]);

    return (
        <main className='flex flex-col justify-center items-center min-h-screen space-y-8'>
            <img src={gwLogo} alt="gwLogo" className='h-32 w-auto mb-1' />
            <div className='flex flex-col justify-center'>
                <h1 className='text-2xl text-center'><b>Core Residency</b><p className='text-base mt-2 font-semibold text-gray-600'>{formattedDate}</p></h1>
            </div>
            <div className='flex flex-col items-center w-60'>
                <LoginButton /> 
                <Link to="/publicview">
                <button className='bg-white text-black border-2 border-gray-400 w-68 mb-8 rounded-xl px-6 py-2 cursor-pointer hover:bg-zinc-300 transition flex justify-center items-center'>
                    View Public Residency Record
                </button>
                </Link>
            </div>
            <p>Developed by <b>Johan Marlo Cabili</b>, <b>Linus Carl Perdon</b>, and <b>Alvin Sean Cua</b></p>
        </main>
    )
}
