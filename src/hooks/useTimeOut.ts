import { useState } from "react";
import { addTimeOut } from "../services/residencyService";

export function useTimeOut() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function handleTimeOut(studentId: string, timeOut: Date) {
    try {
      await addTimeOut(studentId, timeOut);
      setIsLoading(false);
    } catch (err) {
      setError(String(err));
      setIsLoading(false);
    }
  }

  return { handleTimeOut, isLoading, error }
}