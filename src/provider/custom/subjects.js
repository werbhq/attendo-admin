import { dataProviderLegacy } from "../firebase";
import { MAPPING } from "../mapping";

/**
 * Not to be used directly from here
 * Use dataProvider
 */
export const SubjectsProvider = {
  resource: MAPPING.SUBJECT,

  getList: async (params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.SUBJECT,
    });
    const values = Object.values(data.schemes);
    return { data: values, total: values.length };
  },

  getOne: async (params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.SUBJECT,
    });
    return { data: data.schemes[params.id] };
  },
};
