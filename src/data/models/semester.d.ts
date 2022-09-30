export interface Semester {
    id: string;
    totalSemesters: number;
    evenSemester: boolean;
    batches: {
        id: number;
        sem: number | null;
    }[];
}

export interface Courses {
    courses: { [course: string]: Semester };
}
