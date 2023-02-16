import { db, FieldPath } from "../firebase";
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

      const fieldPath = new FieldPath("classrooms", id, "students");
      await db
        .collection(MAPPING.DATA)
        .doc(MAPPING.MASTER_CLASSROOMS)
        .update(fieldPath, data);
    });
    return { data: { id, ...record }, status: 200 };
  },

  updateMany: async (resource, params) => {
    const { id, data } = params;
    await db.runTransaction(async (transaction) => {
      const doc = db.collection(MAPPING.CLASSROOMS).doc(id);
      transaction.update(doc, { students: data });

      const fieldPath = new FieldPath("classrooms", id, "students");
      await db
        .collection(MAPPING.DATA)
        .doc(MAPPING.MASTER_CLASSROOMS)
        .update(fieldPath, data);
    });
    return { data, status: 200 };
  },
};
