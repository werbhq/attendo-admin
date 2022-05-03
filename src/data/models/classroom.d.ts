import { Student } from './student';

export interface Classroom {
    id: string;
    branch: string;
    name: string;
    year: number;
    course: 'BTECH' | 'MTECH';
    schemeId: string;
    isDerived: boolean;
    semester?: number;
    subjectId?: string;
    parentClasses?: string[];
    students: Student[];
}

export interface ClassroomShort {
    id: string;
    branch: string;
    name: string;
    semester: number;
    course: 'BTECH' | 'MTECH';
    schemeId: string;
    isDerived: boolean;
}
