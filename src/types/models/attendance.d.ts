import type { ClassroomTeacher } from './classroom';
import { SemSubject } from './semAttendance';
import type { Student } from './student';
import type { Subject } from './subject';
import type { TeacherShort } from './teacher';

export interface Attendance {
    id: string;
    date: string;
    dateTime: number;
    hour: number;
    classroom: ClassroomTeacher;
    teacher: TeacherShort;
    subject: Subject;
    absentees?: string[];
    unrecognisedNames?: string[];
    lateComers?: string[];
    semester: number;
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

interface CustomSubject extends SemSubject {
    classId: string;
}

interface AttendanceReportResponse {
    semester: number;
    classroomId: string;
    subjects: CustomSubject[];
    attendances: {
        id: string;
        email: string;
        regNo: string;
        userName: string;
        name: string;
        rollNo: number;
        attendance: {
            subjectId: string;
            percentage: number;
        }[];
    }[];
}

interface AttendanceReportResponseFrontEnd {
    id: string;
    email: string;
    regNo: string;
    userName: string;
    name: string;
    rollNo: number;
    attendance: {
        name: string;
        subjectId: string;
        percentage: number;
    }[];
}
