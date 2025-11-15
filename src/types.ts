export type ResidencyLog = {
  id?: number;
  student_uid: string;
  time_in: Date;
  time_out: Date | null;
  residency_type: "core" | "ancillary";
}

export type Student = {
  id: number;
  student_uid: string;
  name: string;
  committee: 
    "customerCare" |
    "layout"       |
    "literary"     |
    "marketing"    |
    "office"       |
    "photo"        |
    "web"
  ; // committee_type
}

export interface ActiveLog {
  id: number;
  student_uid: string;
  time_in: string;
  time_out: string | null;
  residency_type: string;
}

export interface RunningLog{
  student_name: string;
  time_in: string;
  committee: string;
  residency_type: string;
  student_uid: string;
}
