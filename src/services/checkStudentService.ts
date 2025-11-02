import supabase from "@/utils/supabase";

export async function checkStudentExists(uid: string): Promise<boolean> {
  const { data } = await supabase
    .from("students")
    .select("student_uid")
    .eq("student_uid", uid)
    .single();

  return !!data; // true if exists, false if not
}
