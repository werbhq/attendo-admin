import { dataProviderLegacy } from "../firebase";
import { MAPPING } from "../mapping";

/**
 * Not to be used directly from here
 * Use dataProvider
 */
export const SemestersProvider = {
  resource: MAPPING.SEMESTERS,

  getList: async (params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.SEMESTERS,
    });
    const values = Object.values(data.courses);
    return { data: values, total: values.length };
  },

  getOne: async (params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.SEMESTERS,
    });
    return { data: data.courses[params.id] };
  },
};
