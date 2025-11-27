import { useEffect, useState } from "react";
import { getTotalHoursPerStudent } from "@/services/residencyService";
import type { StudentHours } from "@/services/residencyService";
import { Spinner } from "@/components/ui/spinner";
import useSession from "@/hooks/useSession";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PublicView() {
  const [totals, setTotals] = useState<StudentHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommittee, setSelectedCommittee] = useState<string>("all");
  const [searchName, setSearchName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const session = useSession();

  const requiredHours: Record<string, number> = {
    customercare: 18,
    layout: 12,
    literary: 12,
    marketing: 12,
    office: 18,
    photo: 12,
    web: 12
  };

  function formatHM(hours: number) {
    const h = Math.floor(hours);
    let m = Math.round((hours - h) * 60);
    if (m === 60) {
      return `${h + 1}h 0m`;
    }
    return `${h}h ${m}m`;
  }

  function getHoursRemaining(student: StudentHours) {
    const key = student.committee.toLowerCase();
    const required = requiredHours[key];
    const diff = required - student.total_hours;
    return diff > 0 ? formatHM(diff) : "0h 0m";
  }

  useEffect(() => {
    async function fetchTotals() {
      try {
        const data = await getTotalHoursPerStudent();
        setTotals(data);
      } catch (error) {
        console.error("Error fetching total hours:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTotals();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-12 h-12" />
      </div>
    );

  const committees = Array.from(new Set(totals.map((s) => s.committee)));

  const filteredTotals = totals.filter((s) => {
    const matchesCommittee =
      selectedCommittee === "all" || s.committee === selectedCommittee;

    const searchLower = searchName.toLowerCase();
    const nameLower = s.name.toLowerCase();

    const matchesSearch = nameLower.includes(searchLower);

    return matchesCommittee && matchesSearch;
  });

  return (
    <div className="p-4">
      <div className="flex justify-between mb-5 mt-2">
        {/* Dropdown filter */}
        <div className="mb-4 flex gap-2">
          { session ?
            (<Link to="/residency" className="flex text-xs text-gray-600 hover:text-green-600 w-fit">
              <ArrowLeft />
            </Link>) : (
            <Link to="/" className="flex text-xs text-gray-600 hover:text-green-600 w-fit">
              <ArrowLeft />
            </Link>
            ) 
          }
          <div>
            <label htmlFor="committee" className="mr-2 font-medium">
              Filter by Committee:
            </label>
            <select
              id="committee"
              value={selectedCommittee}
              onChange={(e) => {setSelectedCommittee(e.target.value); setSearchName("");}}
              className="border px-2 py-1 rounded"
            >
              <option value="all">All</option>
              {committees.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select> 
          </div> 
          
        </div>

        <div>
          <input
            type="text"
            placeholder="Enter name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {if (e.key == "Enter"){setSearchName(searchInput)}}}
            className="border-2 rounded-sm px-2 py-1"
          />
          <button
            onClick={() => setSearchName(searchInput)}
            className="border-2 rounded-sm mx-2 p-1 cursor-pointer hover:bg-gray-100 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="table-fixed w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Committee</th>
            <th className="border px-4 py-2 text-left">Hours Rendered</th>
            <th className="border px-4 py-2 text-left">
              Hours Remaining (
              {new Date().toLocaleString("default", { month: "long" })})
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredTotals.map((student) => (
            <tr key={student.name} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{student.name}</td>
              <td className="border px-4 py-2">{student.committee}</td>

              {/* Convert decimal hours rendered */}
              <td className="border px-4 py-2">
                {formatHM(student.total_hours)}
              </td>

              <td className="border px-4 py-2">
                {getHoursRemaining(student)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
