import type { Student } from './student';

export interface ClassroomNonVirtual {
    id: string;
    branch: string;
    name: string;
    course: string;
    year: number;
    schemeId: string;
}

export interface ClassroomShort extends ClassroomNonVirtual {
    isDerived: boolean;
    subjectId?: string;
    parentClasses?: {
        [id: string]: ClassroomNonVirtual;
    };
    semester?: number;
}

export interface ClassroomShortTeacher extends ClassroomShort {
    semester: number;
}

export interface Classroom extends ClassroomShort {
    students: Student[];
}

export interface ClassroomIndex {
    classrooms: {
        [id: string]: Classroom;
    };
}
