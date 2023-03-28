import type { ClassroomShort } from './classroom';
import type { StudentShort } from './student';
import type { Subject } from './subject';
import type { TeacherShort } from './teacher';
import type { Meta } from './meta';

export interface AttendanceShort {
    id: string;
    date: string;
    dateTime: number;
    hour: number;
    semester: number;
    classroom: ClassroomShort;
    teacher: TeacherShort;
    subject: Subject;
}

export interface Attendance extends AttendanceShort {
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
    absentees: string[];
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

interface _StudentAttendance extends StudentShort {
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

export function SubjectAttendanceToAttendances(data: SubjectAttendance) {
    const { semester, subject, classroom, attendances, teachers } = data;

    const attendanceData: Attendance[] = [];

    Object.values(attendances).forEach((doc) => {
        const { teacherId } = doc;

        const attendanceDoc: Attendance = {
            id: doc.id,
            date: doc.date,
            dateTime: doc.dateTime,
            hour: doc.hour,
            absentees: doc.absentees ?? [],
            unrecognisedNames: doc.unrecognisedNames ?? [],
            lateComers: doc.lateComers ?? [],
            leaves: doc.leaves ?? [],
            teacher: teachers?.find((e) => e.id === teacherId) ?? {
                id: teacherId,
                emailId: teacherId,
                name: teacherId,
            },
            semester,
            classroom,
            subject,
        };

        attendanceData.push(attendanceDoc);
    });

    return attendanceData;
}

export interface ClassAttendance {
    id: string;
    classroom: ClassroomShort;
    dateTime?: number;
    date?: string;
    hour?: number;
    students: {
        [id: string]: 'Present' | 'Absent' | 'Unknown';
    };
}
