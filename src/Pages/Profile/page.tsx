import { useParams } from "react-router-dom"
import { Header } from "@/components/ui/header";
import { StudentResidencyTable } from "@/components/ui/residency";
import { useStudentResidencyRecord } from "@/hooks/useResidencyLogs";

export default function Profile() {
  const { slug } = useParams();
  const { records, isLoading } = useStudentResidencyRecord(slug)

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex-1 flex flex-col px-12 py-8 gap-6 overflow-y-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-bold">{ records[0]?.name || "Loading name..." }</h1>
          {/* TODO: TURN THIS INTO A FUNCTION  */}
          <p className="bg-black rounded-4xl text-white font-semibold text-sm py-1 px-2 w-fit">
            { records[0]?.committee
              .split(' ')
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ')
              || "Loading committee..." 
            }
          </p>
        </div> 

        <div className="flex flex-1 flex-col gap-2">
          <h2 className="font-semibold text-2xl">Residency Logs</h2>
          <StudentResidencyTable records={records} isLoading={isLoading} />
        </div> 
      </div>
    </div>
  )
}
