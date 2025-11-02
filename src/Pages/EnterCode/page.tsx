import gwLogo from '@/assets/gw_logo.png'

export default function EnterCode() {
    return (
        <main className='flex flex-col justify-center items-center min-h-screen space-y-4'>
            <img src={gwLogo} alt="gwLogo" className='h-32 w-auto' />
            <div>
                <input type="password" placeholder='Enter code here' className='border rounded-sm px-2 py-1' required/>
                <button className='m-2 border rounded-sm p-1 cursor-pointer hover:bg-gray-100 transition'>Submit</button>
            </div>
        </main>
    )
}
