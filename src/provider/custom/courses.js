import { dataProviderLegacy, db, FieldValue } from "../firebase";
import { MAPPING } from "../mapping";

/**
 * Don't call this directly
 * Use dataProvider
 */
export const SemestersProvider = {
  resource: MAPPING.COURSES,

  getList: async (resource, params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.COURSES,
    });
    const values = Object.values(data.courses);
    // console.log(values);
    return { data: values, total: values.length };
  },
  getOne: async (resource, params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.COURSES,
    });
    return { data: data.courses[params.id] };
  },

  create: async (resource, params) => {
    const { id, data } = params;

    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.COURSES)
      .update({ [`courses.${id}`]: data });

    return { data: { id }, status: 200 };
  },

  update: async (resource, params) => {
    const { id, data } = params;

    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.COURSES)
      .update({ [`courses.${id}`]: data });

    return { data, status: 200 };
  },

  delete: async (resource, params) => {
    const { id } = params;

    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.COURSES)
      .update({
        [`courses.${id}`]: FieldValue.delete(),
      });

    return { data: { id }, status: 200 };
  },
};
