import { useParams } from "react-router-dom"
import { Header } from "@/components/ui/header";
import { StudentResidencyTable } from "@/components/ui/residency";

export default function Profile() {
  const { slug } = useParams();
  
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex-1 flex flex-col px-12 py-8 gap-6 overflow-y-auto">
        <div>
          <h1 className="text-5xl font-bold">{ slug }</h1>
          <p>Committee</p>
        </div> 

        <div>
          <h2>Residency Logs</h2>
          <StudentResidencyTable />
        </div> 
      </div>
    </div>
  )
}
