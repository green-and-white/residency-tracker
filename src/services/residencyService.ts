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