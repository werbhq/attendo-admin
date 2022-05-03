import { dataProviderLegacy, db } from "../firebase";
import { MAPPING } from "../mapping";

/**
 * Not to be used directly from here
 * Use dataProvider
 */
export const studentsProvider = {
  resource: MAPPING.STUDENTS,

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

  update: async (params) => {
    const { id, data, record } = params;
    await db.runTransaction(async (transaction) => {
      const doc = db.collection(MAPPING.CLASSROOMS).doc(id);
      transaction.update(doc, { students: data });
    });
    return { data: record, status: 200 };
  },

  updateMany: async (params) => {
    const { id, data } = params;
    await db.runTransaction(async (transaction) => {
      const doc = db.collection(MAPPING.CLASSROOMS).doc(id);
      transaction.update(doc, { students: data });
    });
    return { data, status: 200 };
  },
};
