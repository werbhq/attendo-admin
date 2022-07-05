import { ClassroomShort, ClassroomShortTeacher } from './classroom';
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
