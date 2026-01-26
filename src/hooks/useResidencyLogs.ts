import { useState, useEffect } from "react";
import {
  fetchResidencyLogs,
  fetchResidencyRecords,
  fetchActiveResidencyLogs,
  fetchStudentResidencyRecords,
  fetchResidencyRecordsByMonth
} from "../services/residencyService";
import type { ResidencyLog, RunningLog, StudentResidencyRecord } from "../types";

export function useStudentResidencyRecord(id: string | undefined) {
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getResidencyRecords() {
      try {
        // TODO: add type
        const data: any = await fetchStudentResidencyRecords(id);
        setRecords(data);
        setIsLoading(false);
      } catch(err) {
        setError(String(err));
        setIsLoading(false);
      }
    }
    getResidencyRecords();
  }, [id]);

  return { records, isLoading, error };
}

export function useResidencyRecords() {
  const [records, setRecords] = useState<StudentResidencyRecord[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getResidenyRecords() {
      try {
        const data: StudentResidencyRecord[] = await fetchResidencyRecords();
        setRecords(data);
        setIsLoading(false);
      } catch(err) {
        setError(String(err));
        setIsLoading(false);
      }
    }
    getResidenyRecords();
  }, []);

  return { records, isLoading, error };
}

export function useResidencyRecordsByMonth() {
  const [records, setRecords] = useState<StudentResidencyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getResidencyRecordsByMonth() {
      try {
        setIsLoading(true);
        const data: StudentResidencyRecord[] = await fetchResidencyRecordsByMonth();
        setRecords(data);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    }

    getResidencyRecordsByMonth();
  }, []);

  return { records, isLoading, error };
}

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