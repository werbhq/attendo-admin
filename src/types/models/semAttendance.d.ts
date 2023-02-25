import type { ClassroomTeacher } from './classroom';

type ClassroomSem = Omit<ClassroomTeacher, 'parentClasses'>;
export interface ClassroomSemAttendance extends ClassroomSem {
    parentClasses?: string[];
}
export interface SemSubject {
    subjectId: string;
    name: string;
    total: number;
}
export interface SemAttendance {
    id: string;
    semester: number;
    classroom: ClassroomSemAttendance;
    totalAttendance: {
        [subjectId: string]: SemSubject;
    };
    students: {
        [studentId: string]: {
            studentId: string;
            attendances: {
                [subjectId: string]: {
                    subjectId: string;
                    absent: number;
                };
            };
        };
    };
}
