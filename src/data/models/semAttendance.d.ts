import type { ClassroomShortTeacher } from './classroom';

export interface SemAttendance {
    id: string;
    semester: number;
    classroom: ClassroomShortTeacher;
    totalAttendance: {
        [subjectId: string]: {
            subjectId: string;
            name: string;
            total: number;
        };
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
