import { useState, useEffect } from "react";
import { fetchResidencyLogs, fetchActiveResidencyLogs } from "../services/residencyService";
import type { ResidencyLog, RunningLog } from "../types";

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

export function useActiveResidencyLogs() {
  const [activeLogs, setActiveLogs] = useState<RunningLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getActiveResidencyLogs() {
      try {
        const data = await fetchActiveResidencyLogs();
        setActiveLogs(data);
        setIsLoading(false);
      } catch (err) {
        setError(String(err));
        setIsLoading(false);
      }
    }
  
    getActiveResidencyLogs();
  }, []);
  

  return { activeLogs, isLoading, error };
}