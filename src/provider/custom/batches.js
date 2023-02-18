import { sorter } from "../../Utils/helpers";
import {
  dataProvider,
  dataProviderLegacy,
  db,
  FieldValue,
  FieldPath,
} from "../firebase";
import { MAPPING } from "../mapping";

/**
 * Don't call this directly
 * Use dataProvider
 */
export const BatchesProvider = {
  resource: MAPPING.BATCHES,

  getList: async (resource, params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.BATCHES,
    });
    const values = Object.values(data.batches);
    return { data: sorter(params, values), total: values.length };
  },

  getOne: async (resource, params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.BATCHES,
    });
    return { data: data.batches[params.id], status: 200 };
  },

  getMany: async (resource, params) => {
    const { ids } = params;
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.BATCHES,
    });

    const dataResult = ids.map((e) => data.batches[e]);

    return { data: dataResult, status: 200 };
  },

  create: async (resource, params) => {
    const { id, data } = params;

    const fieldPath = new FieldPath("batches", id);
    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.BATCHES)
      .update(fieldPath, data);

    return { data: { id }, status: 200 };
  },

  update: async (resource, params) => {
    const { id, data } = params;

    const fieldPath = new FieldPath("batches", id);
    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.BATCHES)
      .update(fieldPath, data);

    return { data, status: 200 };
  },

  delete: async (resource, params) => {
    const { id } = params;

    const fieldPath = new FieldPath("batches", id);
    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.BATCHES)
      .update(fieldPath, FieldValue.delete());

    return { data: { id }, status: 200 };
  },

  deleteMany: async (resource, params) => {
    const { ids } = params;
    for (const id of ids) await dataProvider.delete(resource, { id });
    return { data: ids, status: 200 };
  },
};