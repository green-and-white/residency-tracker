import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import Select, { type SingleValue } from 'react-select'
import { type OptionType } from "@/types";
import { ResidencyRecordsTable } from "@/components/ui/residency";
import { useResidencyRecords } from "@/hooks/useResidencyLogs";
// import { getTotalHoursPerStudent } from "@/services/residencyService";
// import type { StudentHours } from "@/services/residencyService";
// import { Spinner } from "@/components/ui/spinner";
// // import useSession from "@/hooks/useSession";
// import { ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";

export default function PublicView() {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const records = useResidencyRecords() 
  const options: OptionType[] = [
    { value: "customerCare", label: "Customer Care" },
    { value: "layout", label: "Layout" },
    { value: "literary", label: "Literary" },
    { value: "marketing", label: "Marketing" },
    { value: "office", label: "Office" },
    { value: "photo", label: "Photo" },
    { value: "web", label: "Web" }
  ];

  const handleSelection = (option: SingleValue<OptionType>) => {
    setSelectedOption(option);
    console.log(option)
  }; 

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex-1 flex flex-col px-12 py-8 gap-6 overflow-y-auto">
        <h1 className="text-5xl font-bold">GW Residency</h1>
        
        {/* Search & Filter */}
        <div className="grid grid-cols-2 gap-2 w-1/2 text-sm">
          <div className="flex flex-col">
            <label htmlFor="stafferName" className="font-semibold mb-1">Staffer Name</label>
            <input 
              name="stafferName"
              type="text"
              className="h-full border border-[#ccc] bg-white rounded-sm px-2"
              placeholder="Juan de la Cruz"
            /> 
          </div>
          <div className="flex flex-col">
            <label htmlFor="committee" className="font-semibold mb-1">Committee</label>
            <Select
              value={selectedOption} 
              onChange={handleSelection} 
              options={options} 
              placeholder="Select a committee"
              className="text-sm" 
            />             
          </div>
        </div>
      
        {/* Table */}
        <ResidencyRecordsTable records={records.records} isLoading={records.isLoading}/>

      </div> 
    </div>
  );
}
