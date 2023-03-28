import { Classroom } from 'types/models/classroom';

export interface ClassroomFrontend extends Omit<Classroom, 'parentClasses' | 'teachers'> {
    parentClasses: string[];
    teachers: string[];
}
