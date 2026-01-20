import { useEffect, useState, useRef } from "react";
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
import Select, { type SingleValue } from 'react-select'
import { Header } from "@/components/ui/header";
import { type OptionType } from "@/types";
import { CampusIdResidency } from "@/components/ui/residency";

const UID_LENGTH = 10

export default function Residency() {
  const [studentId, setStudentId] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [activeLogs, setActiveLogs] = useState<RunningLog[]>([]);
  const [isStudentFound, setIsStudentFound] = useState(true);
  const { handleTimeIn } = useTimeInCore()
  const { handleTimeOut } = useTimeOut()

  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  const inputRef = useRef<HTMLInputElement>(null)
  const submittedRef = useRef(false)

  const fetchLogs = async () => {
    const data = await fetchActiveResidencyLogs()
    // console.log(data)
    setActiveLogs(data);
  };

  useEffect(() => {
    //get active residency logs on initial render and every submit
    fetchLogs();
  }, [])

  const handleTimeOutTable = async (studentId: string) => {
    await addTimeOut(studentId, new Date());
    await fetchLogs();
    setIsStudentFound(true);
  };

  const handleSubmit = async (uid: string) => {
    if (!selectedOption) {
      alert("Please select a location before scanning your ID.");
      return;
    }

    setIsStudentFound(true);
    setIsLoading(true)
    const currentTimestamp = new Date()

    try {
      const exists = await checkStudentExists(uid);
      if (!exists) {
        // alert("Student UID not found.");
        setIsStudentFound(false);
        setIsLoading(false);
        return;
      }

      const activeLog = await hasActiveLogToday(uid);

      if (activeLog) {
        await handleTimeOut(uid, currentTimestamp);
        toast.success('Successfully timed out.', {
          description: "Enjoy the rest of your day!",
          duration: 2000
        });
      } else {
        await handleTimeIn(uid, currentTimestamp, selectedOption!.value);
        toast.success('Successfully timed in.', {
          description: "Glad to see you!",
          duration: 2000
        });
      }

      setStudentId("")
      await fetchLogs();
      setIsStudentFound(true);

    } catch (err) {
      console.error(err)
      alert('An error occurred.')
    } finally {
      setIsLoading(false)
      setStudentId("")
      submittedRef.current = false
      inputRef.current?.focus()
    }
  };

  const handleScanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > UID_LENGTH) return;
    setStudentId(value)

    if (value.length === UID_LENGTH && !submittedRef.current) {
      submittedRef.current = true
      handleSubmit(value)
    }
  };

  const options: OptionType[] = [
    { value: 'Pictorials', label: 'Pictorials' },
    { value: 'YB Frame Claiming', label: 'YB Frame Claiming' },
    { value: 'Registration', label: 'Registration' },
  ];

  const handleSelection = (option: SingleValue<OptionType>) => {
    setSelectedOption(option);
    console.log(option);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Toaster position="top-right" />
      <Header />

<div className="h-24 w-full bg-white px-8 flex items-center justify-between font-bold text-3xl">
  <span className="ml-12">
    {selectedOption ? selectedOption.label : "Choose location"}
  </span>

  <div className="flex items-center gap-2">
    <Link
      to="/publicview"
      className="border rounded-md px-4 py-2 bg-gray-100 text-sm font-normal hover:bg-gray-300 transition"
    >
      View Residency Logs
    </Link>

    <div className="text-sm mt-8">
      <LogoutButton />
    </div>

    <div className="w-40">
      <Select
        value={selectedOption}
        onChange={handleSelection}
        options={options}
        placeholder="Select location"
        className="text-sm"
      />
    </div>
  </div>
</div>


      <div className="flex flex-row items-center justify-center space-y-4 overflow-auto">
        <div className="flex flex-col items-center mt-15">
          <div className="m-4 space-y-6">
            <div className="flex flex-col">
              {!isStudentFound && <p className="mt-1 text-xs italic text-red-600">*Student not found.</p>}

              <div
                onClick={() => inputRef.current?.focus()}
                className="cursor-pointer select-none px-12 py-28 w-sm rounded-sm bg-white text-black text-center
                           border-2 border-gray-300 hover:border-green-500 active:border-green-600 active:border-3"
              >
                Click here before scanning your ID <br />
                <span className="text-gray-500">Scan your ID on the RFID sensor</span>
              </div>

              <input
                ref={inputRef}
                type="password"
                value={studentId}
                onChange={handleScanChange}
                onCopy={(e) => e.preventDefault()}
                className="absolute opacity-0 w-sm"
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col items-center">
              {isLoading && (
                <div className="mb-2 flex items-center justify-center">
                  <Spinner className="h-4 w-auto text-gray-600" />
                </div>
              )}
              <CampusIdResidency selectedOption={selectedOption} fetchLogs={fetchLogs}/>
              {/* <a href="https://forms.gle/NJ1ACmyBTcYXjy5L8" target="_blank" rel="noopener noreferrer"
                className="text-xs text-gray-600 hover:text-green-600 underline text-center w-full"
              >
                Don't have your student ID? Click here
              </a> */}
            </div>
          </div>
        </div>

        {/* Table */}
        <div>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Committee</th>
                <th className="border border-gray-300 px-4 py-2">Time in</th>
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
                    <td className="border border-gray-300 px-4 py-2">{log.committee}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(`${log.time_in}Z`).toLocaleTimeString("en-PH", {
                        timeZone: "Asia/Manila",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
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
      </div>
    </div>
  );
}
