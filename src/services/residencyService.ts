import supabase from "../utils/supabase";

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

export async function addTimeIn(studentId: number, timeIn: Date, residencyType: string) {
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

export async function addTimeOut(studentId: number, timeOut: Date) {
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
