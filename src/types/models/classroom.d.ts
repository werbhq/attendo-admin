import type { Merge } from '../merge';
import type { Batch, BatchShort } from './batch';
import type { StudentShort } from './student';
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
    group: string | null;
}

interface _BaseClassroom extends _BaseClassroomShort {
    batch: Batch;
    students: { [id: string]: StudentShort };
}

// -----------------Classroom Actual Types -----------------

// Actual Types
export interface ClassroomNonVirtualShort extends _BaseClassroomShort {
    id: string;
    branch: string;
    name: string;
    group: string | null;
    batch: BatchShort;
}

export interface ClassroomNonVirtual extends _BaseClassroom {
    isDerived: false;
    subjects: { [id: string]: ClassroomSubject };
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
    groupLinks: {
        id: string;
        group: string;
    }[];
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
