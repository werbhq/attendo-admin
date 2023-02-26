import { httpsCallable } from 'firebase/functions';
import { sorter } from '../../Utils/helpers';
import {
    cloudFunctions,
    dataProvider,
    db,
    defaultParams,
    FieldPath,
    FieldValue,
} from '../firebase';
import { MAPPING } from '../mapping';
import { DataProviderCustom } from '../../types/DataProvider';
import { AuthorizedTeacher } from '../../types/models/teacher';

/**
 * Don't call this directly
 * Use dataProvider
 */
const AuthTeachersProvider: DataProviderCustom<AuthorizedTeacher> = {
    resource: MAPPING.AUTH_TEACHERS,

    getList: async (resource, params) => {
        const { data } = await dataProvider.getOne(MAPPING.DATA, {
            id: MAPPING.AUTH_TEACHERS,
        });

        const values = Object.values(data.teachers) as AuthorizedTeacher[];

        return { data: sorter(params, values), total: values.length, status: 200 };
    },

    getOne: async (resource, params) => {
        const { data } = await dataProvider.getOne(MAPPING.DATA, {
            id: MAPPING.AUTH_TEACHERS,
        });
        return { data: data.teachers[params.id], status: 200 };
    },

    getMany: async (resource, params) => {
        const { ids } = params;
        const { data } = await dataProvider.getList<AuthorizedTeacher>(resource, defaultParams);
        const finalData = data.filter((e) => ids.includes(e.id));
        return { data: finalData, status: 200 };
    },

    getManyReference: async (resource, params) => {
        const { ids } = params;
        const { data } = await dataProvider.getList<AuthorizedTeacher>(resource, defaultParams);
        const finalData = data.filter((e) => ids.includes(e.id));
        return { data: finalData, status: 200 };
    },

    update: async (resource, params) => {
        const { id, data } = params;

        const fieldPath = new FieldPath('teachers', id as string);
        await db.collection(MAPPING.DATA).doc(MAPPING.AUTH_TEACHERS).update(fieldPath, data);

        return { data, status: 200 };
    },

    updateMany: async (resource, params) => {
        const { ids, data } = params;

        await Promise.all(
            ids.map((e) => {
                return dataProvider.update(resource, {
                    id: e,
                    data,
                    previousData: data,
                });
            })
        );

        return { data: ids as string[], status: 200 };
    },

    delete: async (resource, params) => {
        const { id } = params;

        const fieldPath = new FieldPath('teachers', id);
        await db
            .collection(MAPPING.DATA)
            .doc(MAPPING.AUTH_TEACHERS)
            .update(fieldPath, FieldValue.delete());

        return { data: { id }, status: 200 };
    },

    deleteMany: async (resource, params) => {
        const { ids } = params;
        for (const id of ids) await dataProvider.delete(resource, { id });
        return { data: ids, status: 200 };
    },
};

export const AuthTeachersProviderExtended = {
    createEmails: async (selectedIds: string[]) => {
        const createAccountApi = httpsCallable(cloudFunctions, 'createAccounts');
        const response = await (await createAccountApi(selectedIds)).data;
        return response as { message: string; success: boolean };
    },
};

export default AuthTeachersProvider;
