import { sorter } from "../../Utils/helpers";
import {
  dataProvider,
  dataProviderLegacy,
  db,
  FieldPath,
  FieldValue,
} from "../firebase";
import { MAPPING } from "../mapping";

/**
 * Don't call this directly
 * Use dataProvider
 */
export const SubjectsProvider = {
  resource: MAPPING.SUBJECT,

  getList: async (resource, params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.SUBJECT,
    });
    const values = Object.values(data.schemes);
    return { data: sorter(params, values), total: values.length, status: 200 };
  },

  getOne: async (resource, params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.SUBJECT,
    });
    return { data: data.schemes[params.id], status: 200 };
  },

  getMany: async (resource, params) => {
    const { ids } = params;
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.SUBJECT,
    });
    const result = ids.map((e) => data.schemes[e]);
    return { data: result, status: 200 };
  },

  update: async (resource, params) => {
    const { id, data } = params;

    const fieldPath = new FieldPath("schemes", id);
    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.SUBJECT)
      .update(fieldPath, data);

    return { data, status: 200 };
  },

  delete: async (resource, params) => {
    const { id } = params;

    const fieldPath = new FieldPath("schemes", id);
    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.SUBJECT)
      .update(fieldPath, FieldValue.delete());

    return { data: { id }, status: 200 };
  },

  create: async (resource, params) => {
    const { data, id } = params;

    const fieldPath = new FieldPath("schemes", id);
    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.SUBJECT)
      .update(fieldPath, data);

    return { data: { id }, status: 200 };
  },

  deleteMany: async (resource, params) => {
    const { ids } = params;
    for (const id of ids) await dataProvider.delete(resource, { id });
    return { data: ids, status: 200 };
  },
};
