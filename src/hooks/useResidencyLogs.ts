import { useState, useEffect } from "react";
import {
  fetchResidencyLogs,
  fetchResidencyRecords,
  fetchActiveResidencyLogs,
  fetchStudentResidencyRecords
} from "../services/residencyService";
import type { ResidencyLog, RunningLog, StudentResidencyRecord } from "../types";

export function useStudentResidencyRecord(student_uid: string | undefined) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getResidenyRecords() {
      try {
        const data: any = await fetchStudentResidencyRecords(student_uid || "");
        setRecords(data);
        setIsLoading(false);
      } catch(err) {
        setError(String(err));
        setIsLoading(false);
      }
    }
    getResidenyRecords();
  }, [student_uid]);

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