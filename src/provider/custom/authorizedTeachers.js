import { dataProviderLegacy, db, FieldValue } from "../firebase";
import { MAPPING } from "../mapping";

/**
 * Don't call this directly
 * Use dataProvider
 */
export const AuthTeachersProvider = {
  resource: MAPPING.AUTH_TEACHERS,

  getList: async (resource, params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.AUTH_TEACHERS,
    });
    const values = Object.values(data.teachers);
    return { data: values, total: values.length, status: 200 };
  },

  getOne: async (resource, params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.AUTH_TEACHERS,
    });
    return { data: data.teachers[params.id], status: 200 };
  },

  update: async (resource, params) => {
    const { id, data } = params;

    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.AUTH_TEACHERS)
      .update({
        [`teachers.${id}`]: data,
      });

    return { data, status: 200 };
  },
  delete: async (resource, params) => {
    const { id } = params;

    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.AUTH_TEACHERS)
      .update({
        [`teachers.${id}`]: FieldValue.delete(),
      });

    return { data: { id }, status: 200 };
  },
  create: async (resource, params) => {
    const { data, id } = params;

    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.AUTH_TEACHERS)
      .update({ [`teachers.${id}`]: data });

    return { data: { id }, status: 200 };
  },
};
