import { useState, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Spinner } from "./spinner";
import { Toaster, toast } from 'sonner';
import type { StudentResidencyRecord, OptionType } from "@/types";
import { useNavigate } from "react-router-dom";
import { checkStudentExistsWithId } from "@/services/checkStudentService";
import { hasActiveLogToday } from "@/services/residencyService";
import { useTimeInCore } from "@/hooks/useTimeIn";
import { useTimeOut } from "@/hooks/useTimeOut";
import { ArrowDownUp } from "lucide-react";

export function CampusIdResidency(
  { selectedOption, fetchLogs } : 
  { selectedOption: OptionType | null, fetchLogs: () => Promise<void>}) 
{
  const [studentId, setStudentId] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const adminCode = import.meta.env.VITE_APP_PASSWORD;
  const { handleTimeIn } = useTimeInCore()
  const { handleTimeOut } = useTimeOut()
  
  const handleClick = async () => {
    const currentTimestamp = new Date(); 
    setError(false);
    setIsLoading(true);
    
    if (code === adminCode && studentId.trim() !== "" && selectedOption !== null) {
      console.log("PASS!") 
      try {
        if (!selectedOption) {
          setError(true);
          setIsLoading(false);
          return;
        }

        const existingId = await checkStudentExistsWithId(studentId);
        if (!existingId) {
          setError(true);
          setIsLoading(false);
          return;
        }

        const activeLog = await hasActiveLogToday(existingId);
        if (activeLog) {
          await handleTimeOut(existingId, currentTimestamp);
          toast.success('Successfully timed out.', {
            description: "Enjoy the rest of your day!",
            duration: 2000
          });
        } else {
          await handleTimeIn(existingId, currentTimestamp, selectedOption.value);
          toast.success('Successfully timed in.', {
            description: "Glad to see you!",
            duration: 2000
          });
        }

        await fetchLogs();
        setStudentId("");
        setCode("");
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setIsLoading(false);
        console.error(error);
      }
    } else {
      setError(true);
      setIsLoading(false);
    }
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentId(e.target.value);
    if (error) {
      setError(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    if (error) {
      setError(false);
    }
  };

  const resetForm = () => {
    setError(false);
    setStudentId("");
    setCode("");
  };

  return (
    <>
      <Toaster position="top-right" />
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <p
            className="cursor-pointer text-xs text-gray-600 hover:text-green-600 underline text-center w-full"
          >
            Don't have your student ID? Click here
          </p> 
        </Dialog.Trigger>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-(--shadow-6) focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-[17px] font-medium text-gray-900">
            No ID? 
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-gray-600">
            Enter student ID and admin code to manually start and end residency:
          </Dialog.Description>
          
          <fieldset className="mb-[15px] flex flex-col gap-2">
            <label className="text-[13px] text-gray-700 font-medium">
              Student ID
            </label>
            <input
              type="text"
              value={studentId}
              placeholder="Enter student ID"
              className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded py-2 px-2.5 text-[15px] leading-none text-gray-700 shadow-[0_0_0_1px] shadow-gray-300 outline-none focus:shadow-[0_0_0_2px] focus:shadow-blue-500"
              onChange={handleStudentIdChange}
            />
          </fieldset>

          <fieldset className="mb-[15px] flex flex-col gap-2">
            <label className="text-[13px] text-gray-700 font-medium">
              Admin Code
            </label>
            <input
              type="password"
              value={code}
              placeholder="Enter admin code"
              className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded py-2 px-2.5 text-[15px] leading-none text-gray-700 shadow-[0_0_0_1px] shadow-gray-300 outline-none focus:shadow-[0_0_0_2px] focus:shadow-blue-500"
              onChange={handleCodeChange}
            />
          </fieldset>

          <div className="mt-[25px] flex justify-end">
            <div className="flex flex-col gap-2 items-end">
              <button
                onClick={handleClick}
                disabled={!studentId || !code}
                className={`inline-flex h-[35px] items-center justify-center rounded px-[15px] font-medium leading-none outline-none outline-offset-1 focus-visible:outline-2 select-none ${
                  !studentId || !code
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-100 text-green-700 hover:bg-green-200 focus-visible:outline-green-500 cursor-pointer"
                }`}
              >
                {isLoading ? <Spinner className="h-5 w-5 text-gray-600" /> : "Log"}
              </button>
              {error && (
                <p className="text-xs text-red-600">
                  *Incorrect details. Residency prohibited. Kindly check inputs or selected location.
                </p>
              )}
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              className="cursor-pointer absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 focus:shadow-[0_0_0_2px] focus:shadow-blue-500 focus:outline-none"
              aria-label="Close"
              onClick={resetForm}
            >
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}

export function AdminPromptBox({ onTimeOut }: { onTimeOut: () => Promise<void> }) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const adminPassword = import.meta.env.VITE_APP_PASSWORD;

  const handleClick = async () => {
    setError(false);
    setIsLoading(true);
    if (password === adminPassword) {
      setPassword(""); 
      onTimeOut();
      // setIsStudentFound();
      toast.success('Successfully timed out.', { description: "Enjoy the rest of your day!", duration: 2000 });
    } else {
      setError(true);
      setIsLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    
    if (error) {
      setError(false);
    } 
  }
  
  return (
    <>
    <Toaster position="top-right" /> 
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className='cursor-pointer bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mg-4'>
          Time Out 
        </button>
      </Dialog.Trigger>
      <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-overlayShow" />
      <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-(--shadow-6) focus:outline-none data-[state=open]:animate-contentShow">
        <Dialog.Title className="m-0 text-[17px] font-medium text-gray-900">
          Time out?
        </Dialog.Title>
        <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-gray-600">
          Enter admin password to manually end residency:
        </Dialog.Description>
        <fieldset className="mb-[15px] flex items-center">
          <input
            type="password"
            value={password}
            className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-gray-700 shadow-[0_0_0_1px] shadow-gray-300 outline-none focus:shadow-[0_0_0_2px] focus:shadow-blue-500"
            onChange={handleChange} 
          />
        </fieldset>
        <div className="mt-[25px] flex justify-end"> 
          <div className="flex flex-col gap-2 items-end">
            <button 
              // disable the button if there is no input
              onClick={handleClick}
              disabled={!password}
              className={`inline-flex h-[35px] items-center justify-center rounded px-[15px] font-medium leading-none outline-none outline-offset-1 focus-visible:outline-2 select-none ${
                !password 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-green-100 text-green-700 hover:bg-green-200 focus-visible:outline-green-500 cursor-pointer"
                }`}
            >
              {isLoading ? <Spinner className="h-5 w-5 text-gray-600" /> : "End residency"}
            </button>
          
            {error && <p className="text-xs text-red-600">*Incorrect admin password. Time out prohibitted.</p>} 
          </div> 
        </div>
        <Dialog.Close asChild>
          <button
            className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 focus:shadow-[0_0_0_2px] focus:shadow-blue-500 focus:outline-none"
            aria-label="Close"
            onClick={()=>{setError(false); setPassword("")}}
          >
            <X />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
    </>
  );
}

export function StudentResidencyTable(
  { records, isLoading } :
  { records: any[], isLoading: boolean }
) {
  const tableHeaders = ["Date", "Type", "Booth", "Time in - Time out", "Total Hours Rendered"];
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;
  const validRecords = records.filter(record => record.time_in !== null);
  const totalPages = Math.ceil(validRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = validRecords.slice(startIndex, endIndex);
  
  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };
  
  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };
  
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  const formatHours = (hours: number) => 
    `${Math.floor(hours)} hours ${Math.round((hours % 1) * 60)} minutes`;
  
  const formatDate = (timestamp: string) => {
    const date = new Date(`${timestamp}Z`);
    return date.toLocaleDateString('en-PH', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatTime = (timeIn: string, timeOut: string) => {
    const timeInDate = new Date(`${timeIn}Z`);
    const timeOutDate = new Date(`${timeOut}Z`);
    const timeInFormatted = timeInDate.toLocaleTimeString('en-PH', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Manila'
    });
    const timeOutFormatted = timeOutDate.toLocaleTimeString('en-PH', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Manila'
    });
    console.log("Unformatted: ", timeIn);
    console.log("Formatted: ", timeInFormatted);
    
    return `${timeInFormatted} - ${timeOutFormatted}`;
  };
  
  return (
    <div className="flex flex-col gap-4">
      <table className="flex-1 text-sm w-4/5">
        <thead>
          <tr className="text-left text-gray-500 border-2">
            {tableHeaders.map((header) => {
              return (
                <th className="p-4" key={header}>{header}</th>
              );
            })}  
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="text-center p-4 border-2">Loading records...</td>
            </tr>
          ) : currentRecords.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4 border-2 text-gray-500">
                No residency recorded yet.
              </td>
            </tr>
          ) : (
            currentRecords.map((record, index) => (
              <tr 
                key={index}
                className="text-left border-2 hover:bg-gray-200"
              >
                <td className="p-4">{formatDate(record.time_in)}</td>
                <td className="p-4">
                  {record.residency_type.charAt(0).toUpperCase() + 
                  record.residency_type.slice(1)}
                </td>
                <td className="p-4">{record.location}</td>
                <td className="p-4">{formatTime(record.time_in, record.time_out)}</td>
                <td className="p-4">{formatHours(record.hours)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between w-4/5 px-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, validRecords.length)} of {validRecords.length} records
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="cursor-pointer px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`cursor-pointer px-3 py-1 border rounded ${
                    currentPage === pageNum
                      ? 'bg-[#00a84f] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="cursor-pointer px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ResidencyRecordsTable(
  { records, isLoading } :
  { records: StudentResidencyRecord[], isLoading: boolean })
{
  const navigate = useNavigate(); 
  const tableHeaders = ["Staffer Name", "Committee", "Core Hours", "Ancilliary Hours", "Hours Rendered"];
  const forSorting = ["Core Hours", "Ancilliary Hours", "Hours Rendered"];
  const [currentPage, setCurrentPage] = useState(1);
  const currentMonth = new Date().toLocaleDateString('en-PH', { month: 'short' }); 

  // TODO: Turn into a type 
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const recordsPerPage = 6;

  const sortedRecords = useMemo(() => {
    if (!sortConfig) return records;

    const sorted = [...records].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortConfig.key) {
        case 'Core Hours':
          aValue = a.core;
          bValue = b.core;
          break;
        case 'Ancilliary Hours':
          aValue = a.ancillary;
          bValue = b.ancillary;
          break;
        case 'Hours Rendered':
          aValue = a.core + a.ancillary;
          bValue = b.core + b.ancillary;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [records, sortConfig]);

  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = sortedRecords.slice(startIndex, endIndex);

  const handleSort = (header: string) => {
    if (!forSorting.includes(header)) return;

    setSortConfig((current) => {
      // If clicking the same column toggle ascending/decscending 
      if (current?.key === header) {
        return {
          key: header,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      // If clicking a new column, start with ascending
      return {
        key: header,
        direction: 'asc'
      };
    });

    // Reset to first page when sorting
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatHours = (hours: number) => 
  `${Math.floor(hours)} hours ${Math.round((hours % 1) * 60)} minutes`;

  const formatCommittee = (value: string) => {
    const options = {
      customerCare: "Customer Care",
      layout: "Layout",
      literary: "Literary",
      marketing: "Marketing",
      office: "Office",
      photo: "Photo",
      web: "Web"
    };

    const out: string = options[value as keyof typeof options];

    return out;
  };

  return (
    <div className="flex flex-col gap-4">
      <table className="flex-1 text-sm w-4/5">
        <thead>
          <tr className="text-left text-gray-500 border-2">
            {tableHeaders.map((header) => {
              const isActive = sortConfig?.key === header;
              return (
                <th className="p-4" key={header}>
                  <div className="flex items-center">
                    {header}
                    { header === "Hours Rendered" && ` (${currentMonth})`}
                    { forSorting.includes(header) && 
                      <ArrowDownUp 
                        className={`ml-3 cursor-pointer hover:text-gray-900 ${
                          isActive ? 'text-[#00a84f]' : ''
                        }`}
                        onClick={() => handleSort(header)}
                      />
                    } 
                  </div> 
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="text-center p-4 border-2">Loading staffers...</td>
            </tr>
          ) : (
            currentRecords.map((record) => (
                <tr 
                  onClick={()=>navigate(`/profile/${record.id}`)} 
                  key={record.name} 
                  className="text-left border-2 hover:bg-gray-200 hover:cursor-pointer"
                >
                  <td className="p-4 w-1.5/5">{record.name}</td>
                  <td className="p-4">{formatCommittee(record.committee)}</td>
                  <td className="p-4">{formatHours(record.core)}</td>
                  <td className="p-4">{formatHours(record.ancillary)}</td>
                  {/* TODO CHANGE THIS PER MONTH: */}
                  <td className="p-4">{formatHours(record.ancillary + record.core)}</td>
              </tr> 
            ))
          )}
        </tbody> 
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between w-4/5 px-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedRecords.length)} of {sortedRecords.length} records
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="cursor-pointer px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`cursor-pointer px-3 py-1 border rounded ${
                    currentPage === pageNum
                      ? 'bg-[#00a84f] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="cursor-pointer px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}