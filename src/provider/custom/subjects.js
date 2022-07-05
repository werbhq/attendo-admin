import { sorter } from "../../Utils/helpers";
import { dataProviderLegacy, db, FieldPath, FieldValue } from "../firebase";
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
};
