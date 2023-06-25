import { DataProviderCustom } from 'types/DataProvider';
import { Course } from 'types/models/courses';
import { FieldValue, FieldPath } from '../firebase';
import { paginateSingleDoc } from '../helpers/pagination';
import { MAPPING } from '../mapping';

/**
 * Don't call this directly
 * Use dataProvider
 */
const CoursesProvider: DataProviderCustom<Course> = {
    resource: MAPPING.COURSES,

    getList: async (resource, params, providers) => {
        const { dataProviderLegacy } = providers;
        const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
            id: MAPPING.COURSES,
        });
        const values = Object.values(data.courses) as Course[];
        return { data: paginateSingleDoc(params, values), total: values.length };
    },

    getOne: async (resource, params, providers) => {
        const { dataProviderLegacy } = providers;
        const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
            id: MAPPING.COURSES,
        });
        return { data: data.courses[params.id], status: 200 };
    },

    getMany: async (resource, params, providers) => {
        const { dataProviderLegacy } = providers;
        const { ids } = params;
        const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
            id: MAPPING.COURSES,
        });

        const dataResult = ids.map((e) => data.courses[e]);

        return { data: dataResult, status: 200 };
    },

    create: async (resource, params, providers) => {
        const { data } = params;
        const { dataProviderCustom } = providers;
        const firestore = dataProviderCustom.app.firestore();

        const fieldPath = new FieldPath('courses', data.id);
        await firestore.collection(MAPPING.DATA).doc(MAPPING.COURSES).update(fieldPath, data);

        return { data: data, status: 200 };
    },

    update: async (resource, params, providers) => {
        const { id, data } = params;
        const { dataProviderCustom } = providers;
        const firestore = dataProviderCustom.app.firestore();

        const fieldPath = new FieldPath('courses', id as string);
        await firestore.collection(MAPPING.DATA).doc(MAPPING.COURSES).update(fieldPath, data);

        return { data, status: 200 };
    },

    delete: async (resource, params, providers) => {
        const { id } = params;
        const { dataProviderCustom } = providers;
        const firestore = dataProviderCustom.app.firestore();

        const fieldPath = new FieldPath('courses', id);
        await firestore
            .collection(MAPPING.DATA)
            .doc(MAPPING.COURSES)
            .update(fieldPath, FieldValue.delete());

        return { data: { id }, status: 200 };
    },

    deleteMany: async (resource, params, providers) => {
        const { ids } = params;
        const { dataProviderCustom } = providers;
        for (const id of ids) await dataProviderCustom.delete(resource, { id });
        return { data: ids, status: 200 };
    },
};

export default CoursesProvider;
