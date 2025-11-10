import gwLogo from '@/assets/gw_logo.png'
import gwebLogo from '@/assets/g&web_logo.png'
import residencyTrackerLogo from '@/assets/residency_tracker_logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { createLoginCode } from '@/services/loginCodeService'
import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

export default function Main() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        setIsLoading(true)
        try {
            await createLoginCode()
            navigate('/entercode', { replace: true })
        } catch (err) {
            console.error(err)
            alert('Failed to generate login code')
            setIsLoading(false)
        }
    }

    return (
        <main className='flex flex-col justify-center items-center min-h-screen space-y-8'>
            <img src={gwLogo} alt="gwLogo" className='h-32 w-auto' />
            <img src={residencyTrackerLogo} alt="residencyTrackerLogo" className='h-32 w-auto'/>
            <div className='flex flex-col items-center w-60'>
                <button onClick={handleClick} className='border-2 w-full mb-8 rounded-xl px-6 py-2 cursor-pointer hover:bg-gray-100 transition flex justify-center items-center'>
                    {isLoading ? <Spinner className="h-5 w-5 text-gray-600" /> : 'Log in'}
                </button>
                <Link to="/publicview" className="underline text-center w-full">
                View public residency records
                </Link>
            </div>
            <img src={gwebLogo} alt="gwebLogo" className='h-25 w-auto' />
        </main>
    )
}
