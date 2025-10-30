export type ResidencyLog = {
  id: number;
  student_uid: string;
  time_in: Date;
  time_out: Date | null;
  residency_type: "core" | "ancilliary";
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