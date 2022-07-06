import { ClassroomShort, ClassroomShortTeacher } from './classroom';
import { Student } from './student';
import { Subject } from './subject';
import { TeacherShort } from './teacher';

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
