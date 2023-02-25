import { GetListParams, RaRecord } from 'react-admin';
import { Classroom } from '../types/models/classroom';
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
    if (data.isDerived) dataIdSet.push(data.subjectId);
    return dataIdSet.join('-').toUpperCase();
};

/**
 * Sorter for getList data
 */
export function sorter<T extends RaRecord>(params: GetListParams, data: T[]) {
    const sort = params?.sort;
    const filters = params?.filter as { [key: string]: any };

    if (sort) {
        const field = sort.field;

        if (Array.isArray(data)) {
            data = data.sort((a, b) => {
                if (typeof a[field] === 'string') {
                    if (sort.order === 'DESC') return b[field]?.localeCompare(a[field]);
                    return a[field]?.localeCompare(b[field]);
                } else if (typeof a[field] === 'number') {
                    if (sort.order === 'DESC') return b[field] - a[field];
                    return a[field] - b[field];
                } else if (typeof a.id === 'string' && typeof b.id === 'string') {
                    return a.id.localeCompare(b.id as string);
                }

                return true;
            });
        }
    }

    if (filters && Object.entries(filters).length) {
        Object.entries(filters).forEach(([e_field, value]) => {
            data = data.filter((e) => {
                if (typeof e[e_field] === 'string' || typeof e[e_field] === 'number') {
                    return `${e[e_field]}`.toUpperCase().includes(value.toUpperCase());
                } else if (Array.isArray(e[e_field])) {
                    return e[e_field].includes(value);
                } else if (typeof e[e_field] === 'boolean') {
                    return e[e_field] === value;
                }
                return true;
            });
        });
    }

    return data;
}

export const MODE = {
    PROD: 'prod',
    DEV: 'dev',
    EMULATOR: 'emulate',
};
