import gwLogo from '../../assets/gw_logo.png'
import gwebLogo from '../../assets/g&web_logo.png'
import residencyTrackerLogo from '../../assets/residency_tracker_logo.png'

export default function Main() {
    return (
        <main className='flex flex-col justify-center items-center min-h-screen space-y-4'>
            <img src={gwLogo} alt="gwLogo" className='h-32 w-auto' />
            <img src={residencyTrackerLogo} alt="residencyTrackerLogo" className='h-32 w-auto'/>
            <div>
                <button className='border-2 rounded-xl px-6 py-2 cursor-pointer hover:bg-gray-100 transition'>
                Log in
                </button>
            </div>
            <img src={gwebLogo} alt="gwebLogo" className='h-25 w-auto' />
        </main>
    )
}
