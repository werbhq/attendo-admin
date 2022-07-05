import { ClassroomShortTeacher } from './classroom';

export interface MonthlyAttendance {
    id: string;
    date: string;
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
                    present: number;
                };
            };
        };
    };
}
