import type { ClassroomShort } from './classroom';
import type { Subject } from './subject';

interface Period {
    day: number;
    hour: number;
    lastUpdated: string;
    weight: number;
}

export interface TeacherClassroom {
    gclassroomId?: string;
    tid?: string;
    id: string;
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
    profilePic?: string;
}

export interface Teacher extends TeacherShort {
    userName: string;
    status: string;
    phone?: string;
    classrooms: {
        [id: string]: TeacherClassroom;
    };
}

export interface AuthorizedTeacher {
    id: string;
    email: string;
    userName: string;
    branch: string;
    created: boolean;
}

export interface AuthorizedTeacherIndex {
    teachers: {
        [email: string]: AuthorizedTeacher;
    };
}

export interface TeachersIndex {
    teachers: {
        [key: string]: TeacherShort;
    };
}
