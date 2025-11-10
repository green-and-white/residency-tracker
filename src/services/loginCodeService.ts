import supabase from "@/utils/supabase";

export function generateRandomCode(): number {
  return Math.floor(1000 + Math.random() * 9000); // 1000-9999
}

export async function createLoginCode() {
  const code = generateRandomCode();

  const { data, error } = await supabase.from("logincodes").insert({ code }).select().single()

  if (error) {
    console.error("Error creating login code:", error);
    throw new Error("Unable to generate code.");
  }

  setTimeout(async () => {
    try {
      const { error: delError } = await supabase
        .from("logincodes")
        .delete()
        .eq("id", data.id);

      if (delError) console.error("Error deleting expired login code:", delError);
    } catch (err) {
      console.error("Unexpected error deleting login code:", err);
    }
  }, 600000);

  return code;
}

export async function verifyLoginCode(codeInput: number) {
  const { data, error } = await supabase
    .from("logincodes")
    .select("*")
    .eq("code", codeInput)
    .maybeSingle();

  if (error) {
    console.error("Error verifying login code:", error);
    throw new Error("Unable to verify code.");
  }

  if (!data) {
    return false; // code is invalid
  }

  const { error: delError } = await supabase
    .from("logincodes")
    .delete()
    .eq("id", data.id);

  if (delError) {
    console.error("Error deleting login code:", delError);
  }

  return true; // code is correct
}

export async function getLoginCode() {
    const { data, error } = await supabase
    .from("logincodes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)

    if (error) {
        console.log(error)
    }

    return data
}
