import type { ClassroomShortTeacher } from './classroom';
import type { Student } from './student';
import type { Subject } from './subject';
import type { Period } from './teacher';

export interface GoogleClassroom {
    id: string;
    title: string;
    subTitle: string;
    link: string;
    code: string;
    recoginised: boolean;
    students: Student[];
    classroom?: ClassroomShortTeacher;
    subject?: Subject;
    periods?: Period[];
}

export interface GoogleClassroomDoc {
    teacher: {
        id: string;
        email: string;
    };
    googleClassrooms: GoogleClassroom[];
}
