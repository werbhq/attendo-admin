import { dataProviderLegacy, db, FieldValue } from "../firebase";
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
    return { data: values, total: values.length, status: 200 };
  },

  getOne: async (resource, params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.SUBJECT,
    });
    return { data: data.schemes[params.id], status: 200 };
  },

  update: async (resource, params) => {
    const { id, data } = params;

    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.SUBJECT)
      .update({
        [`schemes.${id}`]: data,
      });

    return { data, status: 200 };
  },
  delete: async (resource, params) => {
    const { id } = params;

    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.SUBJECT)
      .update({
        [`schemes.${id}`]: FieldValue.delete(),
      });

    return { data: { id }, status: 200 };
  },
  create: async (resource, params) => {
    const { data,id } = params;

    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.SUBJECT)
      .update({ [`schemes.${id}`] : data});

    return { data: { id }, status: 200 };
  },
};
