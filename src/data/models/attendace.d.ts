import { ClassroomShort } from './classroom';
import { Subject } from './subject';
import { TeacherShort } from './teacher';

export interface Attendance {
    id: string;
    date: string;
    dateTime: number;
    hour: number;
    classroom: ClassroomShort;
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
