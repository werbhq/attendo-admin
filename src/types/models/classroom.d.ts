import type { Merge } from '../merge';
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

// -----------------Classroom Base Types -----------------
interface _BaseClassroomShort {
    id: string;
    branch: string;
    name: string; // class name
}

interface _BaseClassroom extends _BaseClassroomShort {
    batch: Batch;
    students: Student[];
}

// -----------------Classroom Actual Types -----------------

// Actual Types
export interface ClassroomNonVirtualShort extends _BaseClassroomShort {
    id: string;
    branch: string;
    name: string;
    batch: BatchShort;
}

export interface ClassroomNonVirtual extends _BaseClassroom {
    isDerived: false;
    subjects: Map<String, ClassroomSubject>;
}

export interface ClassroomVirtual extends _BaseClassroom {
    isDerived: true;
    parentClasses: {
        [id: string]: ClassroomNonVirtualShort;
    };
    subject: Subject;
    subjectId: string;
    teachers: TeacherShort[];
    semester: number; // This is to separate the semester in batch vs actual semester in which the virtual class was created
}

// Merged Property
export type Classroom = Merge<ClassroomNonVirtual, ClassroomVirtual>;

export interface ClassroomIndex {
    classrooms: {
        [id: string]: Classroom;
    };
}

// ClassroomShort used in teachers
export interface ClassroomShort extends _BaseClassroomShort {
    batch: BatchShort;
    isDerived: boolean;
    parentClasses?: {
        [id: string]: ClassroomNonVirtualShort;
    };
    subject?: Subject;
}
