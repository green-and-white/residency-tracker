import gwLogo from '@/assets/gw_logo.png'
import gwebLogo from '@/assets/g&web_logo.png'
import residencyTrackerLogo from '@/assets/residency_tracker_logo.png'
import { Link } from 'react-router-dom'
import { LoginButton } from '@/components/ui/auth'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useSession from '@/hooks/useSession'

export default function Main() {
    const session = useSession();
    const navigate = useNavigate();   

    useEffect(() => {
      if (session) {
        navigate("/residency", { replace: true });
      }
    }, [ session, navigate ]);

    return (
        <main className='flex flex-col justify-center items-center min-h-screen space-y-8'>
            <img src={gwLogo} alt="gwLogo" className='h-32 w-auto' />
            <img src={residencyTrackerLogo} alt="residencyTrackerLogo" className='h-32 w-auto'/>
            <div className='flex flex-col items-center w-60'>
                <LoginButton /> 
                <Link to="/publicview" className="underline text-center w-full">
                View public residency records
                </Link>
            </div>
            <img src={gwebLogo} alt="gwebLogo" className='h-25 w-auto' />
        </main>
    )
}
