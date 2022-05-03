import { ClassroomShort } from './classroom';
import { Student } from './student';
import { Subject } from './subject';

export interface googleClassroom {
    id: string;
    title: string;
    subTitle: string;
    link: string;
    code: string;
    recoginised: boolean;
    periods: [];
    students: Student[];
    classroom?: ClassroomShort;
    subject?: Subject;
}

export interface GoogleClassroom {
    teacher: {
        id: string;
        email: string;
    };
    googleClassrooms: googleClassroom[];
}
