import { useEffect, useState } from "react";
import { getTotalHoursPerStudent } from "@/services/residencyService";
import type { StudentHours } from "@/services/residencyService";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Spinner } from "@/components/ui/spinner";

export default function PublicView() {
  const [totals, setTotals] = useState<StudentHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommittee, setSelectedCommittee] = useState<string>("all");

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

  const filteredTotals =
    selectedCommittee === "all"
      ? totals
      : totals.filter((s) => s.committee === selectedCommittee);

  return (
    <div className="p-4">
      <div className="w-155 mb-8">
        <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
            <AccordionTrigger>View shift details</AccordionTrigger>
            <AccordionContent>
            Each staffer must render the following: <br />
            2 to 2.5 hours per week = <strong>4 to 5 shifts</strong><br />
            Office & Customer Care | 4 to 4.5 hours per week = <strong>9 shifts</strong>
            </AccordionContent>
        </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
        <AccordionItem value="item-2">
            <AccordionTrigger>View booth guidelines</AccordionTrigger>
            <AccordionContent>
            Fill up the empty or single occupied slots first. <br />
            At least 1 Office/CC/tenured member must be present during booth manning. <br />
            There needs to be at least 1 person assigned to the yearbook claiming and one for the registration. <br />
            There must be at least 2 to 3 people manning the booth at a time.
            </AccordionContent>
        </AccordionItem>
        </Accordion>
      </div>

      {/* Dropdown filter */}
      <div className="mb-4">
        <label htmlFor="committee" className="mr-2 font-medium">
          Filter by Committee:
        </label>
        <select
          id="committee"
          value={selectedCommittee}
          onChange={(e) => setSelectedCommittee(e.target.value)}
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

      {/* Table */}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Committee</th>
            <th className="border px-4 py-2 text-left">Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {filteredTotals.map((student) => (
            <tr key={student.name} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{student.name}</td>
              <td className="border px-4 py-2">{student.committee}</td>
              <td className="border px-4 py-2">{student.total_hours.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
