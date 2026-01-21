import supabase from "@/utils/supabase";

export async function checkStudentExists(uid: string): Promise<boolean> {
  const { data } = await supabase
    .from("students")
    .select("student_uid")
    .eq("student_uid", uid)
    .single();

  return !!data; // true if exists, false if not
}

export async function checkStudentExistsWithId(id: string): Promise<any | null> {
  const { data } = await supabase
    .from("students")
    .select("student_uid")
    .eq("student_id", id)
    .single();

  return data?.student_uid; 
}

export async function fetchStudentAuthByEmail(email?: string) {
  const { data, error } = await supabase
    .from('students')
    .select('is_authorized')
    .eq('email', email)
    .single();

  if (error) {
    console.error("Service Error: fetchStudentAuthByEmail", error);
    throw new Error("Unable to find student with given email address.");
  }

  return data.is_authorized;
}
