import { ClassroomShort } from './classroom';
import { Subject } from './subject';

interface Period {
    day: number;
    hour: number;
    lastUpdated: string;
    weight: number;
}

export interface TeacherClassroom {
    gclassroomId?: string;
    tid?: string;
    meetLookup?: string;
    periods?: Period[];
    classroom: ClassroomShort;
    semester: number;
    subject: Subject;
    source?: string;
    recognised?: boolean;
}

export interface TeacherShort {
    id: string;
    name: string;
    emailId: string;
}

export interface Teacher extends TeacherShort {
    userName: string;
    status: string;
    phone?: number | null;
    classrooms: TeacherClassroom[];
}

export interface AuthorizedTeacher {
    id: string;
    email: string;
    userName: string;
    branch: string;
}

export interface AuthorizedTeacherIndex {
    teachers: {
        [email: string]: AuthorizedTeacher;
    };
}
