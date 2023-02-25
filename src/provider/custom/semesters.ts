import { sorter } from '../../Utils/helpers';
import { DataProviderCustom } from '../../types/DataProvider';
import { Semester } from '../../types/models/semester';
import { dataProvider, dataProviderLegacy, db, FieldValue, FieldPath } from '../firebase';
import { MAPPING } from '../mapping';

/**
 * Don't call this directly
 * Use dataProvider
 */
export const SemestersProvider: DataProviderCustom<Semester> = {
    resource: MAPPING.SEMESTERS,

    getList: async (resource, params) => {
        const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
            id: MAPPING.SEMESTERS,
        });
        const values = Object.values(data.courses) as Semester[];
        return { data: sorter(params, values), total: values.length };
    },

    getOne: async (resource, params) => {
        const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
            id: MAPPING.SEMESTERS,
        });
        return { data: data.courses[params.id], status: 200 };
    },

    getMany: async (resource, params) => {
        const { ids } = params;
        const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
            id: MAPPING.SEMESTERS,
        });

        const dataResult = ids.map((e) => data.courses[e]);

        return { data: dataResult, status: 200 };
    },

    create: async (resource, params) => {
        const { data, meta } = params;

        const fieldPath = new FieldPath('courses', meta.id);
        await db.collection(MAPPING.DATA).doc(MAPPING.SEMESTERS).update(fieldPath, data);

        return { data: { ...data, id: meta.id }, status: 200 };
    },

    update: async (resource, params) => {
        const { id, data } = params;

        const fieldPath = new FieldPath('courses', id as string);
        await db.collection(MAPPING.DATA).doc(MAPPING.SEMESTERS).update(fieldPath, data);

        return { data, status: 200 };
    },

    delete: async (resource, params) => {
        const { id } = params;

        const fieldPath = new FieldPath('courses', id);
        await db
            .collection(MAPPING.DATA)
            .doc(MAPPING.SEMESTERS)
            .update(fieldPath, FieldValue.delete());

        return { data: { id }, status: 200 };
    },

    deleteMany: async (resource, params) => {
        const { ids } = params;
        for (const id of ids) await dataProvider.delete(resource, { id });
        return { data: ids, status: 200 };
    },
};
