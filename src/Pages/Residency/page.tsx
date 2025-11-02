// import { useState } from "react";
// import { useTimeIn } from "../../hooks/useTimeIn"
// import { useTimeOut } from "../../hooks/useTimeOut";
import Select from 'react-select'
import gwLogo from '../../assets/gw_logo.png'

export default function Residency() {
    // const { handleTimeIn, isLoading, error } = useTimeIn();
    // const { handleTimeOut } = useTimeOut();
    // const currentTimestamp = new Date();  
    // const [isTimedOut, setIsTimedOut] = useState(false);

    const options = [
      { value: "core", label: "Core" },
      { value: "ancillary", label: "Ancillary" },
    ];

    return (
        <main className="flex flex-col items-center min-h-screen space-y-4">
            <img src={gwLogo} alt="gwLogo" className='h-30 w-auto'/>
            <div className="m-5 space-y-5">
              <div className='flex flex-col'>
                <p className='mb-2'>Student UID</p>
                <input type="password" placeholder="Click here when scanning ID" onCopy={(e) => e.preventDefault()} className="border px-3 py-2 w-56 rounded-sm" />
              </div>
              <div className='flex flex-col'>
                <p className='mb-2'>Surname</p>
                <input type="text" placeholder="Enter your surname" className="border px-3 py-2 w-56 rounded-sm" />
              </div>
              <div className='flex flex-col'>
                <p className='mb-2'>Residency type</p>
                <div className='w-56'>
                  <Select options={options} placeholder="Select" className='border rounded-sm' />
                </div>
              </div>
              <div>
                <button className='border rounded-sm px-3 py-2 w-56 mt-20 cursor-pointer hover:bg-gray-100 transition'>Submit</button>
              </div>
            </div>
            <div>
            </div>

            {/* For Testing */}
            {/* <div className="flex gap-2">
                <button 
                  className={`border p-2 ${!isTimedOut && "bg-gray-300 cursor-not-allowed line-through"}`}
                  disabled={!isTimedOut}
                  onClick={async () => {
                    await handleTimeIn(20250001, currentTimestamp, "core");
                    setIsTimedOut(false)
                  }}
                >Time in</button>  

                <button
                  className={`border p-2 ${isTimedOut && "bg-gray-300 cursor-not-allowed line-through"}`}
                  disabled={isTimedOut}
                  onClick={async () => {
                    await handleTimeOut(20250001, currentTimestamp); 
                    setIsTimedOut(true);
                    // Note: check supabase to check reflection!
                  }} 
                >Time out</button> 
            </div> 
            
            { !isLoading &&
              <p>Logged time-in at {currentTimestamp.toISOString()}</p>
            }
            { error && <p>{error}</p> }  
            { isTimedOut && <p>Logged time out at {currentTimestamp.toISOString()}</p>} */}
        </main>
    )
}
