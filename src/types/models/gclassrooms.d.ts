import type { Classroom } from './classroom';
import type { StudentShort } from './student';
import type { Subject } from './subject';
import type { Period } from './teacher';

export interface GoogleClassroom {
    id: string;
    title: string;
    subTitle: string;
    link: string;
    code: string;
    recoginised: boolean;
    students: StudentShort[];
    classroom?: Classroom;
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
