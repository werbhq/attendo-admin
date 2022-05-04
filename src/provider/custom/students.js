import { db } from "../firebase";
import { MAPPING } from "../mapping";

/**
 * Don't call this directly
 * Use dataProvider
 */
export const StudentsProvider = {
  resource: MAPPING.STUDENTS,

  update: async (resource, params) => {
    const { id, data, record } = params;
    await db.runTransaction(async (transaction) => {
      const doc = db.collection(MAPPING.CLASSROOMS).doc(id);
      transaction.update(doc, { students: data });
    });
    return { data: record, status: 200 };
  },

  updateMany: async (resource, params) => {
    const { id, data } = params;
    await db.runTransaction(async (transaction) => {
      const doc = db.collection(MAPPING.CLASSROOMS).doc(id);
      transaction.update(doc, { students: data });
    });
    return { data, status: 200 };
  },
};
