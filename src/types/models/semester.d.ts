export interface Semester {
    id: string;
    totalSemesters: number;
    evenSemester: boolean;
    batches: {
        id: number;
        sem: number | null;
    }[];
}

export interface SemesterIndex {
    courses: { [course: string]: Semester };
}
