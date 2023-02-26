import type { ClassroomShort } from './classroom';
import type { SemSubject } from './semAttendance';
import type { Student } from './student';
import type { Subject } from './subject';
import type { TeacherShort } from './teacher';
import type { Meta } from './meta';
export interface Attendance {
    id: string;
    date: string;
    dateTime: number;
    hour: number;
    semester: number;
    classroom: ClassroomShort;
    teacher: TeacherShort;
    subject: Subject;
    absentees?: string[];
    unrecognisedNames?: string[];
    lateComers?: string[];
    leaves?: string[];
}

export interface AttendanceMini {
    id: string;
    date: string;
    dateTime: number;
    hour: number;
    teacherId: string;
    absentees?: string[];
    unrecognisedNames?: string[];
    lateComers?: string[];
    leaves?: string[];
}

export interface SubjectAttendance {
    id: string;
    classroom: ClassroomShort;
    teachers: TeacherShort[];
    subject: Subject;
    semester: number;
    attendances: { [id: string]: AttendanceMini };
    meta?: Meta;
}
export interface AutoAttendance extends Attendance {
    meetLookup: string;
    userName: string;
}

interface _StudentAttendance extends Student {
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
    attendances: _StudentAttendance[];
}

interface _CustomSubject extends SemSubject {
    classId: string;
}

export interface AttendanceReportResponse {
    semester: number;
    classroomId: string;
    subjects: _CustomSubject[];
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

export interface AttendanceReportResponseFrontEnd {
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
