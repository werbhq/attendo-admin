import { SubjectDoc, SubjectIndex } from 'types/models/subject';
import { DataProviderCustom } from 'types/DataProvider';
import { FieldPath, FieldValue } from '../firebase';
import { MAPPING } from '../mapping';
import { paginateSingleDoc } from '../helpers/pagination';

type SubjectIndexCustom = SubjectIndex & { id: string };

/**
 * Don't call this directly
 * Use dataProvider
 */
const SubjectsProvider: DataProviderCustom<SubjectDoc> = {
    resource: MAPPING.SUBJECT,

    getList: async (resource, params, config) => {
        const { dataProviderLegacy } = config;
        const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
            id: MAPPING.SUBJECT,
        });
        const values = Object.values(data.schemes) as SubjectDoc[];
        return { data: paginateSingleDoc(params, values), total: values.length, status: 200 };
    },

    getOne: async (resource, params, config) => {
        const { dataProviderLegacy } = config;
        const { data } = await dataProviderLegacy.getOne<SubjectIndexCustom>(MAPPING.DATA, {
            id: MAPPING.SUBJECT,
        });

        return { data: data.schemes[params.id], status: 200 };
    },

    getMany: async (resource, params, config) => {
        const { ids } = params;
        const { dataProviderLegacy } = config;
        const { data } = await dataProviderLegacy.getOne<SubjectIndexCustom>(MAPPING.DATA, {
            id: MAPPING.SUBJECT,
        });

        const result = ids.map((e) => data.schemes[e]);
        return { data: result, status: 200 };
    },

    update: async (resource, params, config) => {
        const { id, data } = params;
        const { firestore } = config;

        const fieldPath = new FieldPath('schemes', id as string);
        await firestore.collection(MAPPING.DATA).doc(MAPPING.SUBJECT).update(fieldPath, data);

        return { data, status: 200 };
    },

    delete: async (resource, params, config) => {
        const { id } = params;
        const { firestore } = config;

        const fieldPath = new FieldPath('schemes', id as string);
        await firestore
            .collection(MAPPING.DATA)
            .doc(MAPPING.SUBJECT)
            .update(fieldPath, FieldValue.delete());

        return { data: { id }, status: 200 };
    },

    create: async (resource, params, config) => {
        const { data, meta } = params;
        const { firestore } = config;
        const id = meta.id;

        const { schemes } = (
            await firestore.collection(MAPPING.DATA).doc(MAPPING.SUBJECT).get()
        ).data() as SubjectIndex;

        if (!!schemes[id]) throw new Error(`${id} subject already exists`);

        const fieldPath = new FieldPath('schemes', id);
        await firestore.collection(MAPPING.DATA).doc(MAPPING.SUBJECT).update(fieldPath, data);

        return { data: { ...data, id }, status: 200 };
    },

    deleteMany: async (resource, params, config) => {
        const { ids } = params;
        const { dataProviderLegacy } = config;
        for (const id of ids) await dataProviderLegacy.delete(resource, { id });
        return { data: ids, status: 200 };
    },
};

export default SubjectsProvider;
