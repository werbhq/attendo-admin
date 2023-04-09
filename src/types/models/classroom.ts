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
    batch: BatchShort;
    isDerived: boolean;
}

interface _BaseClassroom extends _BaseClassroomShort {
    batch: Batch;
    students: { [id: string]: StudentShort };
}

// -----------------Classroom Actual Types -----------------

// Actual Types

export interface ClassroomNonVirtualShort extends _BaseClassroomShort {
    isDerived: false;
}
export interface ClassroomVirtualShort extends _BaseClassroomShort {
    isDerived: true;
    parentClasses: {
        [id: string]: ClassroomNonVirtualShort;
    };
    subject: Subject;
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
        group: string | null; // don't make optional
    }[];
}

// Merged Properties
export type Classroom = Merge<ClassroomNonVirtual, ClassroomVirtual>;
export type ClassroomShort = Merge<ClassroomNonVirtualShort, ClassroomVirtualShort>;

export interface ClassroomIndex {
    classrooms: {
        [id: string]: Classroom;
    };
}

export function ClassroomToClassroomShort(data: Classroom) {
    const classroomShort: ClassroomShort = {
        id: data.id,
        branch: data.branch,
        name: data.name,
        group: data.group ?? null,
        isDerived: data.isDerived,
        batch: {
            course: data.batch.course,
            yearOfJoining: data.batch.yearOfJoining,
            id: data.batch.id,
            name: data.batch.name,
            schemeId: data.batch.schemeId,
        },
        ...(data.isDerived
            ? {
                  parentClasses: data?.parentClasses,
                  subject: data?.subject,
              }
            : {}),
    };

    return classroomShort;
}

