import { useState } from "react";
import { addTimeIn } from "../services/residencyService";

export function useTimeIn() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  async function handleTimeIn(studentId: number, timeIn: Date, residencyType: string) {
    try {
      await addTimeIn(studentId, timeIn, residencyType);
      setIsLoading(false);
    } catch (err) {
      setError(String(err));
      setIsLoading(false);
    }
  }
 
  return { handleTimeIn, isLoading, error };
}