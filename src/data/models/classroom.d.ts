import { Student } from './student';

export interface ClassroomShort {
    id: string;
    branch: string;
    name: string;
    course: string;
    year: number;
    schemeId: string;
    isDerived: boolean;
    subjectId?: string;
    parentClasses?: string[];
    semester?: number;
}

export interface ClassroomShortTeacher extends ClassroomShort {
    semester: number;
}

export interface Classroom extends ClassroomShort {
    students: Student[];
}

export interface MasterClassrooms {
    courses: {
        [id: string]: Classroom;
    };
}
