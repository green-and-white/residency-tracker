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

export interface StudentResidencyRecord {
  id: string | undefined; 
  student_uid: string; 
  name: string;
  committee: string;
  core: number;
  ancillary: number;
}

export interface RawStudentResidencyRecord {
  id: string | undefined; 
  student_uid: string; 
  name: string | null;
  committee: string | null;
  residencylogs: {
    residency_type: 'core' | 'ancillary' | null;
    hours: number | string;
    time_in?: string | null;
    time_out?: string | null;
  }[];
}

export interface ActiveLog {
  id: number;
  student_uid: string;
  time_in: string;
  time_out: string | null;
  residency_type: string;
  location: string;
  students: { name: string };
}

export interface RunningLog{
  student_name: string;
  time_in: string;
  committee: string;
  residency_type: string;
  student_uid: string;
  location: string
}

export type OptionType = {
  value: string;
  label: string;
}