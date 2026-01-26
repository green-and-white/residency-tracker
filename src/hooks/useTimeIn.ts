import { useState } from "react";
import { addTimeIn } from "../services/residencyService";

export function useTimeInCore() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  async function handleTimeIn(studentId: string, timeIn: Date, location: string) {
    try {
      let name = await addTimeIn(studentId, timeIn, "core", location);
      setIsLoading(false);
      return name; 
    } catch (err) {
      setError(String(err));
      setIsLoading(false);
      throw err; // Re-throw so the caller can handle it
    }
  }
 
  return { handleTimeIn, isLoading, error };
}

// export function useTimeInAncillary() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
  
//   async function handleTimeIn(studentId: string, timeIn: Date) {
//     try {
//       await addTimeIn(studentId, timeIn, "ancillary");
//       setIsLoading(false);
//     } catch (err) {
//       setError(String(err));
//       setIsLoading(false);
//     }
//   }
 
//   return { handleTimeIn, isLoading, error };
// }