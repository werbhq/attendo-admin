import { Classroom, ClassroomVirtual } from '../types/models/classroom';
import { Student } from '../types/models/student';

export const sortByRoll = (a: Student, b: Student) => {
    if (a.classId && b.classId) {
        if (a.classId !== b.classId) return a.classId.localeCompare(b.classId);
    }
    return a.rollNo - b.rollNo;
};

export const autoCapitalize = (value: string) => value && value.toUpperCase();

export const titleCase = (value: string) => {
    return value
        .toLowerCase()
        .split(' ')
        .map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};

export const convertSingleValueListToSelectList = (value: string) => {
    return { id: value, name: value.toUpperCase() };
};

export const getClassroomId = (data: Classroom) => {
    const dataIdSet = [data.batch.course, data.batch.yearOfJoining, data.branch, data.name];
    if (data.isDerived) {
        const dataVirtual = data as ClassroomVirtual;
        dataIdSet.push(dataVirtual.subjectId);
    }
    return dataIdSet.join('-').toUpperCase();
};

export const MODE = {
    PROD: 'prod',
    DEV: 'dev',
    EMULATOR: 'emulate',
};
