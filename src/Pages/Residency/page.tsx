import { useEffect, useState } from "react";
import gwLogo from '@/assets/gw_logo.png'
import { addTimeOut, hasActiveLogToday } from "@/services/residencyService";
import type { RunningLog } from "@/types";
import { useTimeInCore } from '@/hooks/useTimeIn'
import { useTimeOut } from '@/hooks/useTimeOut'
import { Toaster, toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { checkStudentExists } from "@/services/checkStudentService";
import { fetchActiveResidencyLogs } from "@/services/residencyService";
import { LogoutButton } from "@/components/ui/auth";
import { AdminPromptBox } from "@/components/ui/residency";
import { Link } from "react-router-dom";

export default function Residency() {
    const [studentId, setStudentId] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [activeLogs, setActiveLogs] = useState<RunningLog[]>([]);
    const [isStudentFound, setIsStudentFound] = useState(true);
    const { handleTimeIn } = useTimeInCore()
    const { handleTimeOut } = useTimeOut()

    const fetchLogs = async () => {
      const data = await fetchActiveResidencyLogs();
      // console.log(data)
      setActiveLogs(data);
    }

    useEffect(() => {
      //get active residency logs on initial render and every submit
      fetchLogs();
    }, [])
    
    const handleTimeOutTable = async (studentId: string) => { 
      await addTimeOut(studentId, new Date());
      await fetchLogs();
      setIsStudentFound(true);
    }
    
    const handleSubmit = async () => { 
      setIsStudentFound(true);
      setIsLoading(true)
      const currentTimestamp = new Date()

      try {
        const exists = await checkStudentExists(studentId);
        if (!exists) {
          // alert("Student UID not found.");
          setIsStudentFound(false); 
          setIsLoading(false);
          return;
        }

        const activeLog = await hasActiveLogToday(studentId);

        if (activeLog) {
          await handleTimeOut(studentId, currentTimestamp);
          toast.success('Successfully timed out.', { description: "Enjoy the rest of your day!", duration: 2000 });
        } else {
          await handleTimeIn(studentId, currentTimestamp);
          toast.success('Successfully timed in.', { description: "Glad to see you!", duration: 2000 });
        }

        setStudentId("")
        await fetchLogs();
        setIsStudentFound(true);

      } catch (err) {
        console.error(err)
        alert('An error occured.')
      } finally {
        setIsLoading(false)
        setStudentId("")
      }
    }

    return (
        <>
        <Toaster position="top-right" />
        <main className="flex flex-col lg:flex-row items-center justify-center min-h-screen space-y-4">
          <div className = "flex flex-col items-center">
            <img src={gwLogo} alt="gwLogo" className='h-30 w-auto'/>
            <div className="m-4 space-y-6">
              <div className='flex flex-col'>
                <p className='mb-2'>Student UID</p>
                <input type="password" 
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="Click here when scanning ID" 
                      onCopy={(e) => e.preventDefault()}
                      className="border px-3 py-2 w-sm rounded-sm"
                      required 
                />
                
                {!isStudentFound && <p className='mt-1 text-xs italic text-red-600'>*Student UID not found. Please check field entry.</p>}
              </div>
              <div className="flex flex-col items-center">
                  <button onClick={handleSubmit} className='mb-2 border rounded-sm px-3 py-2 w-sm cursor-pointer hover:bg-gray-100 transition flex items-center justify-center'>
                    {isLoading ? <Spinner className="h-4 w-auto text-gray-600" /> : "Tap to start/end residency"}
                  </button>

                  <LogoutButton />
                  <Link to="/publicview" className="text-xs text-gray-600 hover:text-green-600 underline text-center w-full">
                    View public residency records
                  </Link> 
                  
                </div>
              </div>
            <div>
          </div>
          </div>
          
          {/* Table */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Residency Logs</h2>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Time in</th>
                  <th className="border border-gray-300 px-4 py-2">Committee</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Render active residency logs here */}
                {activeLogs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="border border-gray-300 px-4 py-2 text-center">
                      No active residency logs.
                    </td>
                  </tr>
                ) : (
                  activeLogs.map((log, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{log.student_name}</td>
                      <td className="border border-gray-300 px-4 py-2">{new Date(log.time_in).toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2">{log.committee}</td>
                      <td className = "border border-gray-300 px-4 py-2">
                        <AdminPromptBox 
                          onTimeOut={async() => handleTimeOutTable(log.student_uid)}
                          // setIsStudentFound={setIsStudentFound(false)} 
                        /> 
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          
          </div>
        </main>
        </>
    )
}
