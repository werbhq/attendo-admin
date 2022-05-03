import { db } from "../firebase";
import { MAPPING } from "../mapping";

/**
 * Not to be used directly from here
 * Use dataProvider
 */
export const ClassroomProvider = {
  resource: MAPPING.CLASSROOMS,

  update: async (params) => {
    const { id, data } = params;
    await db
      .collection(MAPPING.CLASSROOMS)
      .doc(id)
      .update({ ...data });

    return { data: data, status: 200 };
  },

  create: async (params) => {
    const { data } = params;
    await db.collection(MAPPING.CLASSROOMS).doc(data.id).set(data);
    return { data, status: 200 };
  },
};
