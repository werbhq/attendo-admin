export interface Semester {
    course: 'BTECH' | 'MTECH';
    batch: {
        id: number;
        sem: number | null;
    }[];
}

export interface Courses {
    courses: { BTECH: Semester; MTECH: Semester };
}
