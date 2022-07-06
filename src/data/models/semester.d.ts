export interface Semester {
    course: string;
    totalSemesters: number;
    evenSemester: boolean;
    batch: {
        id: number;
        sem: number | null;
    }[];
}

export interface Courses {
    courses: { [course: string]: Semester };
}
