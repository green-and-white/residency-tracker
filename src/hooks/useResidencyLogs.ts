import { useState, useEffect } from "react";
import { fetchResidencyLogs } from "../services/residencyService";
import type { ResidencyLog } from "../types";

export function useResidencyLogs() {
  const [logs, setLogs] = useState<ResidencyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    async function getResidencyLogs() {
      try {
        const data:ResidencyLog[] = await fetchResidencyLogs();
        setLogs(data);
        setIsLoading(false);
      } catch(err) {
        setError(String(err));
        setIsLoading(false);
      } 
    }
    getResidencyLogs();
  
  }, []);  

  return { logs, isLoading, error }
}