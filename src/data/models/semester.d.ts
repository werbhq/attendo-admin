export interface Semester {
  course: "BTECH" | "MTECH";
  totalSemesters: number;
  batch: {
    id: number;
    sem: number | null;
  }[];
}

export interface Courses {
  courses: { BTECH: Semester; MTECH: Semester };
}
