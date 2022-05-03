import { ClassroomShort } from './classroom';

export interface MonthlyAttendance {
    id: string;
    date: string;
    semester: number;
    classroom: ClassroomShort;
    totalAttendance: number;
    students: [
        {
            student_id: string;
            attendances: {
                subject_id: string;
                present: number;
            }[];
        }
    ];
}
