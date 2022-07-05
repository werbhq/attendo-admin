import { sorter } from "../../Utils/helpers";
import { dataProviderLegacy } from "../firebase";
import { MAPPING } from "../mapping";

/**
 * Don't call this directly
 * Use dataProvider
 */
export const SemestersProvider = {
  resource: MAPPING.SEMESTERS,

  getList: async (resource, params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.SEMESTERS,
    });
    const values = Object.values(data.courses);
    return { data: sorter(params, values), total: values.length };
  },

  getOne: async (resource, params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.SEMESTERS,
    });
    return { data: data.courses[params.id] };
  },
};