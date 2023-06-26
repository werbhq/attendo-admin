import { DataProviderCustom } from 'types/DataProvider';
import { Batch, BatchList } from 'types/models/batch';
import { FieldValue, FieldPath } from '../firebase';
import { paginateSingleDoc } from '../helpers/pagination';
import { MAPPING } from '../mapping';

/**
 * Don't call this directly
 * Use dataProvider
 */
const BatchesProvider: DataProviderCustom<Batch> = {
    resource: MAPPING.BATCHES,

    getList: async (resource, params, providers) => {
        const { dataProviderLegacy } = providers;
        const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
            id: MAPPING.BATCHES,
        });
        const values = Object.values(data.batches) as Batch[];
        return { data: paginateSingleDoc(params, values), total: values.length };
    },

    getOne: async (resource, params, providers) => {
        const { dataProviderLegacy } = providers;
        const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
            id: MAPPING.BATCHES,
        });
        return { data: data.batches[params.id], status: 200 };
    },

    getMany: async (resource, params, providers) => {
        const { ids } = params;
        const { dataProviderLegacy } = providers;
        const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
            id: MAPPING.BATCHES,
        });

        const dataResult = ids.map((e) => data.batches[e]);

        return { data: dataResult, status: 200 };
    },

    create: async (resource, params, providers) => {
        const { meta, data } = params;
        const { firebaseCollection } = providers;
        const { id } = meta;
        console.log(id);
        const { batches } = (
            await firebaseCollection(MAPPING.DATA).doc(MAPPING.BATCHES).get()
        ).data() as BatchList;
        if (!!batches[id]) throw new Error(`${id} batch already exists`);

        const fieldPath = new FieldPath('batches', id);
        await firebaseCollection(MAPPING.DATA).doc(MAPPING.BATCHES).update(fieldPath, data);

        return { data: { ...data, id: meta.id }, status: 200 };
    },

    update: async (resource, params, providers) => {
        const { id, data } = params;
        const { firebaseCollection } = providers;

        const fieldPath = new FieldPath('batches', id as string);
        await firebaseCollection(MAPPING.DATA).doc(MAPPING.BATCHES).update(fieldPath, data);

        return { data, status: 200 };
    },

    delete: async (resource, params, providers) => {
        const { id } = params;
        const { firebaseCollection } = providers;

        const fieldPath = new FieldPath('batches', id);
        await firebaseCollection(MAPPING.DATA)
            .doc(MAPPING.BATCHES)
            .update(fieldPath, FieldValue.delete());

        return { data: { id }, status: 200 };
    },

    deleteMany: async (resource, params, providers) => {
        const { ids } = params;
        const { dataProviderLegacy } = providers;
        for (const id of ids) await dataProviderLegacy.delete(resource, { id });
        return { data: ids, status: 200 };
    },
};

export default BatchesProvider;
