import type { ClassroomShortTeacher } from './classroom';

interface Period {
    day: number;
    hour: number;
    lastUpdated: string;
    weight: number;
}

export interface TeacherClassroom {
    gclassroomId: string;
    meetLookup?: string;
    periods?: Period[];
    classroom: ClassroomShortTeacher;
    subject: {
        id: string;
        name: string;
        code?: string;
    };
    recognised?: boolean;
}

export interface Teacher {
    id: string;
    emailId: string;
    name: string;
    userName: string;
    status: string;
    phone?: number;
    profilePic?: string;
    classrooms: TeacherClassroom[];
}

export interface AuthorizedTeacher {
    teachers: {
        [email: string]: {
            id: string;
            email: string;
            userName: string;
            branch: string;
        };
    };
}

export interface TeacherShort {
    id: string;
    name: string;
    emailId: string;
    profilePic: string;
}
