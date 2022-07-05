import { sorter } from "../../Utils/helpers";
import { dataProvider, dataProviderLegacy, db } from "../firebase";
import { MAPPING } from "../mapping";

/**
 * Don't call this directly
 * Use dataProvider
 */
export const ClassroomProvider = {
  resource: MAPPING.CLASSROOMS,

  getList: async (resource, params) => {
    let { data, total } = await dataProviderLegacy.getList(resource, params);
    const { data: semesters } = await dataProvider.getList(MAPPING.COURSES);

    data = data.map((e) => {
      const record = { ...e };
      if (!e.semester) {
        const course = semesters.find(({ id }) => id === e.course);
        if (course) {
          const semesterNum = course.batches.find(({ id }) => id === e.year);
          if (semesterNum) record.semester = semesterNum.sem;
        }
      }
      return record;
    });

    return { data: sorter(params, data), total, status: 200 };
  },

  getOne: async (resource, params) => {
    let { data } = await dataProviderLegacy.getOne(resource, params);
    const { data: semesters } = await dataProvider.getList(MAPPING.COURSES);

    const record = { ...data };
    if (!data.semester) {
      const course = semesters.find(({ id }) => id === data.course);
      if (course) {
        const semesterNum = course.batches.find(({ id }) => id === data.year);
        if (semesterNum) record.semester = semesterNum.sem;
      }
    }

    return { data: record };
  },

  update: async (resource, params) => {
    const { id, data } = params;
    await db
      .collection(MAPPING.CLASSROOMS)
      .doc(id)
      .update({ ...data });

    return { data: data, status: 200 };
  },

  create: async (resource, params) => {
    const { data } = params;
    await db.collection(MAPPING.CLASSROOMS).doc(data.id).set(data);
    return { data, status: 200 };
  },
};
