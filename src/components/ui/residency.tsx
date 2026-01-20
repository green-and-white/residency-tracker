import { useState } from "react";
// import supabase from "@/utils/supabase";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Spinner } from "./spinner";
import { Toaster, toast } from 'sonner';

export function AdminPromptBox({ onTimeOut }) {
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

// TODO: ADD TYPE
export function ResidencyRecordsTable({ records, isLoading }: { records: any[], isLoading: boolean }) {
  const tableHeaders = ["Staffer Name", "Committee", "Core Hours", "Ancilliary Hours", "Hours Rendered"];
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;

  const totalPages = Math.ceil(records.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = records.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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

  console.log("RECORDS:", records);

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
              <td colSpan={5} className="text-center p-4 border-2">Loading staffers...</td>
            </tr>
          ) : (
            currentRecords.map((record) => (
              <tr key={record.name} className="text-left border-2 hover:bg-gray-200 hover:cursor-pointer">
                <td className="p-4 w-1.5/5">{record.name}</td>
                <td className="p-4">{formatCommittee(record.committee)}</td>
                <td className="p-4">{record.core}</td>
                <td className="p-4">{record.ancillary}</td>
                <td className="p-4">{record.ancillary + record.core}</td>
              </tr>
            ))
          )}
        </tbody> 
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between w-4/5 px-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, records.length)} of {records.length} records
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