import supabase from "../utils/supabase";

export interface ActiveLog {
  id: number;
  student_uid: string;
  time_in: string;
  time_out: string | null;
  residency_type: string;
}

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
// TODO: add subscribe service to listen to real time changes (if needed)

export async function addTimeIn(studentId: string, timeIn: Date, residencyType: string) {
  const { error } = await supabase
    .from('residencylogs')
    .insert({
      student_uid: studentId,
      time_in: timeIn.toISOString(),
      residency_type: residencyType
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
