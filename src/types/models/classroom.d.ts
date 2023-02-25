import type { Batch, BatchShort } from './batch';
import type { Student } from './student';
import type { Subject } from './subject';
import type { TeacherShort } from './teacher';

export interface ClassroomSubject {
    id: string;
    semester: number;
    subject: Subject;
    teachers: TeacherShort[];
}

// Base Types
interface _Base {
    id: string;
    branch: string;
    name: string; // class name
}

// Classroom

interface _BaseClassroom extends _Base {
    batch: Batch;
    students: Student[];
}

// Actual Types
export interface ClassroomNonVirtual extends _BaseClassroom {
    isDerived: false;
    subjects: ClassroomSubject[];
}

export interface ClassroomNonVirtualShort {
    id: string;
    branch: string;
    name: string;
    batch: BatchShort;
}

export interface ClassroomVirtual extends _BaseClassroom {
    isDerived: true;
    parentClasses: {
        [id: string]: ClassroomNonVirtualShort;
    };
    subject: Subject;
    subjectId: string;
    teachers: TeacherShort[];
    semester: number; // Batch may be up to date with its value
}

export interface ClassroomIndex {
    classrooms: {
        [id: string]: ClassroomNonVirtual & ClassroomVirtual;
    };
}

// ClassroomShort
export interface ClassroomShort extends _Base {
    batch: BatchShort;
    isDerived: boolean;
    parentClasses?: {
        [id: string]: ClassroomNonVirtualShort;
    };
    subject?: Subject;
}

export interface Classroom extends ClassroomNonVirtual, ClassroomVirtual {
    isDerived: boolean;
}
