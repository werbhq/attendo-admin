import type { ClassroomShortTeacher } from './classroom';
import type { Student } from './student';
import type { Subject } from './subject';
import type { TeacherShort } from './teacher';

export interface Attendance {
    id: string;
    date: string;
    dateTime: number;
    hour: number;
    classroom: ClassroomShortTeacher;
    teacher: TeacherShort;
    subject: Subject;
    absentees?: string[];
    unrecognisedNames?: string[];
    lateComers?: string[];
}

export interface AutoAttendance extends Attendance {
    meetLookup: string;
    userName: string;
}

interface StudentAttendance extends Student {
    attendance: {
        subjectId: string;
        percentage: number;
    }[];
}

export interface AttendanceReport {
    range?: {
        from: Date; // Will be monthly
        to: Date; // Will be monthly
    };
    semester?: number;
    classroomId: string;
    subjects: Subject[];
    attendances: StudentAttendance[];
}
