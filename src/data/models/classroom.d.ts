import type { Student } from './student';
import type { BatchShort } from './batch';

export interface ClassroomNonVirtual {
    id: string;
    branch: string;
    name: string;
    course: string;
    year: number;
    schemeId: string;
    batch: BatchShort;
}

export interface ClassroomShort extends ClassroomNonVirtual {
    isDerived: boolean;
    subjectId?: string;
    parentClasses?: {
        [id: string]: ClassroomNonVirtual;
    };
    semester?: number;
}

export interface Classroom extends ClassroomShort {
    students: Student[];
    batch: Batch;
}

export interface ClassroomIndex {
    classrooms: {
        [id: string]: Classroom;
    };
}
