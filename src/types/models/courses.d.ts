export interface Course {
    id: string;
    totalSemesters: number;
}

export interface CoursesIndex {
    courses: { [course: string]: Course };
}
