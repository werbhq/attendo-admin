import { DataProviderCustom } from 'types/DataProvider';
import { Batch } from 'types/models/batch';
import { FieldValue, FieldPath } from '../firebase';
import { paginateSingleDoc } from '../helpers/pagination';
import { MAPPING } from '../mapping';

/**
 * Don't call this directly
 * Use dataProvider
 */
const BatchesProvider: DataProviderCustom<Batch> = {
    resource: MAPPING.BATCHES,

    getList: async (resource, params, config) => {
        const { dataProviderLegacy } = config;
        const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
            id: MAPPING.BATCHES,
        });
        const values = Object.values(data.batches) as Batch[];
        return { data: paginateSingleDoc(params, values), total: values.length };
    },

    getOne: async (resource, params, config) => {
        const { dataProviderLegacy } = config;
        const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
            id: MAPPING.BATCHES,
        });
        return { data: data.batches[params.id], status: 200 };
    },

    getMany: async (resource, params, config) => {
        const { ids } = params;
        const { dataProviderLegacy } = config;
        const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
            id: MAPPING.BATCHES,
        });

        const dataResult = ids.map((e) => data.batches[e]);

        return { data: dataResult, status: 200 };
    },

    create: async (resource, params, config) => {
        const { meta, data } = params;
        const { dataProviderLegacy, firestore } = config;
        const { id } = meta;

        const { data: exists } = await dataProviderLegacy.getOne<Batch>(resource, { id });
        if (exists) throw new Error(`${id} batch already exists`);

        const fieldPath = new FieldPath('batches', id);
        await firestore.collection(MAPPING.DATA).doc(MAPPING.BATCHES).update(fieldPath, data);

        return { data: { ...data, id: meta.id }, status: 200 };
    },

    update: async (resource, params, config) => {
        const { id, data } = params;
        const { firestore } = config;

        const fieldPath = new FieldPath('batches', id as string);
        await firestore.collection(MAPPING.DATA).doc(MAPPING.BATCHES).update(fieldPath, data);

        return { data, status: 200 };
    },

    delete: async (resource, params, config) => {
        const { id } = params;
        const { firestore } = config;

        const fieldPath = new FieldPath('batches', id);
        await firestore
            .collection(MAPPING.DATA)
            .doc(MAPPING.BATCHES)
            .update(fieldPath, FieldValue.delete());

        return { data: { id }, status: 200 };
    },

    deleteMany: async (resource, params, config) => {
        const { ids } = params;
        const { dataProviderLegacy } = config;
        for (const id of ids) await dataProviderLegacy.delete(resource, { id });
        return { data: ids, status: 200 };
    },
};

export default BatchesProvider;
