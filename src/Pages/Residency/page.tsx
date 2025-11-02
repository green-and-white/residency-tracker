import { useState } from "react";
import Select from 'react-select'
import gwLogo from '@/assets/gw_logo.png'
import { hasActiveLogToday } from "@/services/residencyService";
import { useTimeIn } from '@/hooks/useTimeIn'
import { useTimeOut } from '@/hooks/useTimeOut'
import { Toaster, toast } from 'sonner'
import { useNavigate } from "react-router-dom"
import { destroySession } from "@/utils/session";

export default function Residency() {
    const [studentId, setStudentId] = useState("")
    const [surname, setSurname] = useState("")
    const [residencyType, setResidencyType] = useState<string | null>(null)

    const { handleTimeIn } = useTimeIn()
    const { handleTimeOut } = useTimeOut()

    const navigate = useNavigate();

    const options = [
      { value: "core", label: "Core" },
      { value: "ancillary", label: "Ancillary" },
    ];

    const handleSubmit = async () => {
      if (!studentId || !residencyType){
        alert("Please fill in all the fields.")
        return;
      }

      const currentTimestamp = new Date()

      try {
        const alreadyTimedIn = await hasActiveLogToday(studentId)
        if (alreadyTimedIn) {
          await handleTimeOut(studentId, currentTimestamp)
          toast.success('Successfully timed out.', { description: "Enjoy the rest of your day!", duration: 5000 })
        } else {
          await handleTimeIn(studentId, currentTimestamp, residencyType)
          toast.success('Successfully timed in.', { description: "Glad to see you!", duration: 5000 })
        }

        setStudentId("")
        setSurname("")
        setResidencyType(null)

        setTimeout(() => {
          destroySession();
          navigate("/", { replace: true })
        }, 5000)

      } catch (err) {
        console.error(err)
        alert('An error occured.')
      }
    }

    return (
        <>
        <Toaster position="top-right" />
        <main className="flex flex-col items-center min-h-screen space-y-4">
            <img src={gwLogo} alt="gwLogo" className='h-30 w-auto'/>
            <div className="m-5 space-y-5">
              <div className='flex flex-col'>
                <p className='mb-2'>Student UID</p>
                <input type="password" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Click here when scanning ID" onCopy={(e) => e.preventDefault()} className="border px-3 py-2 w-56 rounded-sm" />
              </div>
              <div className='flex flex-col'>
                <p className='mb-2'>Surname</p>
                <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Enter your surname" className="border px-3 py-2 w-56 rounded-sm" />
              </div>
              <div className='flex flex-col'>
                <p className='mb-2'>Residency type</p>
                <div className='w-56'>
                  <Select options={options} placeholder="Select" value={options.find((o) => o.value === residencyType) || null} onChange={(option) => setResidencyType(option?.value ?? null)} className='border rounded-sm' />
                </div>
              </div>
              <div>
                <button onClick={handleSubmit} className='border rounded-sm px-3 py-2 w-56 mt-20 cursor-pointer hover:bg-gray-100 transition'>Submit</button>
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
        </>
    )
}
