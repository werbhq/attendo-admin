import { Classroom } from './classroom';

export interface StudentShort {
    id: string;
    email: string;
    regNo: string;
    userName: string;
    name: string;
    rollNo: number;
    classId?: string;
    aliases?: string[];
}

export interface Student extends StudentShort {
    classrooms: { [id: string]: Classroom };
    batch: Batch;
}

interface StudentIndexEntry {
    id: string;
    name: string;
    email: string;
    regNo: string;
    classroom: {
        id: string;
        name: string;
        branch: string;
    };
}

export interface StudentsIndex {
    batchId: string;
    students: {
        [key: string]: StudentIndexEntry;
    };
}
