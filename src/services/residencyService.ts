import supabase from "../utils/supabase";
import type { ActiveLog, RunningLog } from "@/types";
import type { StudentResidencyRecord, RawStudentResidencyRecord } from "@/types";

export async function fetchResidencyLogs() {
  const { data, error } = await supabase
    .from("residencylogs")
    .select('*');

  if (error) {
    console.error("Service Error: fetchResidencyLogs", error);
    throw new Error("Could not retrieve logs from database.");
  }
 
  return data || [];
}

export async function fetchResidencyRecords(): Promise<StudentResidencyRecord[]> {
  const { data, error } = await supabase
  .from("students")
    .select(`
      student_uid, 
      name,
      committee,
      residencylogs (
        residency_type,
        hours 
      )
    `) as { data: RawStudentResidencyRecord[] | null, error: any };  
    // .from("residencylogs")
    // .select(`
    //   residency_type,
    //   hours,
    //   students (
    //     name,
    //     committee 
    //   )
    // `);

  if (error) {
    console.error("Service Error: fetchResidencyRecords", error);
    throw new Error("Could not retrieve residency records from database.");
  }

  const totals: Record<string, StudentResidencyRecord> = {};
  data?.forEach((student) => {
    const name = student.name || "Unknown";
    const student_uid = student.student_uid || "N/A";
    const committee = student.committee || "N/A";
    
    if (!totals[name]) {
      totals[name] = { student_uid, name, committee, core: 0, ancillary: 0 };
    }
    
    student.residencylogs?.forEach((log) => {
      const type = log.residency_type;
      const hours = Number(log.hours) || 0;
      
      // Add the hours to the correct category
      totals[name][type] += hours;
    });
  });


  return Object.values(totals) || [];
}

export async function addTimeIn(studentId: string, timeIn: Date, residencyType: string, location: string) {
  const { error } = await supabase
    .from('residencylogs')
    .insert({
      student_uid: studentId,
      time_in: timeIn.toISOString(),
      residency_type: residencyType,
      location: location
    });
  
  if (error) {
    console.error("Service Error: addTimeIn", error);
    throw new Error("Unable to create a residency log to time in.");
  }
}

export async function addTimeOut(studentId: string, timeOut: Date) {
  const { error } = await supabase
    .from('residencylogs')
    .update({ time_out: timeOut.toISOString() })
    .eq('student_uid', studentId)
    .is('time_out', null);

  if (error) {
    console.error("Service Error: addTimeOut", error);
    throw new Error("Unable to update residency log to time out.")
  }
}

export async function hasActiveLogToday(studentId: string): Promise<ActiveLog | null> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('residencylogs')
    .select('*')
    .eq('student_uid', studentId)
    .gte('time_in', startOfDay.toISOString())
    .lte('time_in', endOfDay.toISOString())
    .is('time_out', null)
    .maybeSingle();

  if (error) {
    console.error('Service Error: hasActiveLogToday', error);
    throw new Error('Could not check for existing logs.');
  }

  return data;
}

export interface StudentHours {
  name: string;
  total_hours: number;
  committee: string;
}

export async function getTotalHoursPerStudent(): Promise<StudentHours[]> {
  const { data: students, error: studentError } = await supabase
    .from("students")
    .select("student_uid, name, committee");

  if (studentError || !students) {
    console.error("Error fetching students:", studentError);
    throw new Error("Could not fetch students");
  }

  const validStudents = students.filter((s) => s.committee !== null);
  const logs = await fetchResidencyLogs();

  const uidToInfo: Record<string, { name: string; committee: string }> = {};
  validStudents.forEach((s) => {
    uidToInfo[s.student_uid] = { name: s.name, committee: s.committee! };
  });

  const totals: Record<string, { total_hours: number; committee: string }> = {};
  validStudents.forEach((s) => {
    totals[s.name] = { total_hours: 0, committee: s.committee! };
  });

  logs.forEach((log: ActiveLog) => {
    if (!log.time_out) return;

    const studentInfo = uidToInfo[log.student_uid];
    if (!studentInfo) return;

    const timeIn = new Date(log.time_in);
    const timeOut = new Date(log.time_out);
    let hours = (timeOut.getTime() - timeIn.getTime()) / 1000 / 3600;

    if (log.residency_type.toLowerCase() === "ancillary") {
      hours /= 2;
    }

    totals[studentInfo.name].total_hours += hours;
  });

  return Object.entries(totals).map(([name, data]) => ({
    name,
    total_hours: data.total_hours,
    committee: data.committee,
  }));
}

export async function fetchActiveResidencyLogs(): Promise<RunningLog[]> {

  //Query all logs within the current day that have no time_out value

  const today = new Date(); 
  const start = today.setHours(0, 0, 0, 0);
  const end = today.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("residencylogs")
    .select("time_in, students(name, committee), residency_type, student_uid")
    .gte("time_in", new Date(start).toISOString())
    .lte("time_in", new Date(end).toISOString()) 
    .eq("residency_type", "core")
    .is("time_out", null);

  if (error) {
    console.error("Service Error: getActiveResidencyLogs", error);
    throw new Error("Could not retrieve active residency logs.");
  }

  const formattedLogs: RunningLog[] = (data || []).map((log: any) => {
    const student = Array.isArray(log.students) ? log.students[0] : log.students;
    return {
      student_name: student?.name ?? "Unknown",
      time_in: log.time_in,
      committee: student?.committee ?? "Unknown",
      residency_type: log.residency_type,
      student_uid: log.student_uid
    };
  });

  return formattedLogs;
}
