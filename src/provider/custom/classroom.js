import { sorter } from "../../Utils/helpers";
import {
  dataProvider,
  dataProviderLegacy,
  db,
  FieldPath,
  FieldValue,
} from "../firebase";
import { MAPPING } from "../mapping";

/**
 * Don't call this directly
 * Use dataProvider
 */
export const ClassroomProvider = {
  resource: MAPPING.CLASSROOMS,

  getList: async (resource, params) => {
    let { data, total } = await dataProviderLegacy.getList(resource, params);
    const { data: semesters } = await dataProvider.getList(MAPPING.SEMESTERS);
    const { data: subjects } = await dataProvider.getList(MAPPING.SUBJECT);

    data = data.map((e) => {
      const record = { ...e };
      if (!e.semester) {
        const course = semesters.find(({ id }) => id === e.course);
        if (course) {
          const semesterNum = course.batches.find(({ id }) => id === e.year);
          if (semesterNum) record.semester = semesterNum.sem;
        }
      }

      if (record.isDerived) {
        record.parentClasses = Object.keys(record.parentClasses);
      }

      if (record.semester && record.isDerived) {
        const subjectsScheme = subjects.find((e) => e.id === record.schemeId);
        if (subjectsScheme) {
          const subject = subjectsScheme.semesters
            .find((e) => e.semester === record.semester)
            ?.branchSubs?.find((e) => e.branch === record.branch)
            ?.subjects.find((e) => e.id === record.subjectId);

          record.subjectName = subject?.name;
        }
      }

      return record;
    });

    return { data: sorter(params, data), total, status: 200 };
  },

  getOne: async (resource, params) => {
    let { data: record } = await dataProviderLegacy.getOne(resource, params);
    const { data: course } = await dataProvider.getOne(MAPPING.SEMESTERS, {
      id: record.course,
    });
    const { data: subjects } = await dataProvider.getOne(MAPPING.SUBJECT, {
      id: record.schemeId,
    });

    if (!record.semester) {
      if (course) {
        const semesterNum = course.batches.find(({ id }) => id === record.year);
        if (semesterNum) record.semester = semesterNum.sem;
      }
    }

    if (record.semester && subjects && record.isDerived) {
      const subject = subjects.semesters
        .find((e) => e.semester === record.semester)
        ?.branchSubs?.find((e) => e.branch === record.branch)
        ?.subjects.find((e) => e.id === record.subjectId);

      record.subjectName = subject?.name;
    }

    if (record.isDerived) {
      record.parentClasses = Object.keys(record.parentClasses);
    }

    return { data: record };
  },

  getMany: async (resource, params) => {
    const { ids } = params;
    const data = await Promise.all(
      ids.map(
        async (e) => await (await dataProvider.getOne(resource, { id: e })).data
      )
    );
    return { data, status: 200 };
  },

  update: async (resource, params) => {
    const { id, data } = params;

    if (data.isDerived) {
      const parentClasses = {};
      await Promise.all(
        data?.parentClasses.map(async (e) => {
          const { data } = await dataProvider.getOne(resource, { id: e });
          parentClasses[data.id] = {
            id: data.id,
            branch: data.branch,
            name: data.name,
            course: data.course,
            year: data.year,
            schemeId: data.schemeId,
          };
        })
      );

      data.parentClasses = parentClasses;
    }

    await db
      .collection(MAPPING.CLASSROOMS)
      .doc(id)
      .update({ ...data });

    const fieldPath = new FieldPath("classrooms", id);
    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.MASTER_CLASSROOMS)
      .update(fieldPath, data);

    return { data: data, status: 200 };
  },

  create: async (resource, params) => {
    const { data } = params;

    if (data.isDerived) {
      const parentClasses = {};

      await Promise.all(
        data?.parentClasses.map(async (e) => {
          const { data } = await dataProvider.getOne(resource, { id: e });
          parentClasses[data.id] = {
            id: data.id,
            branch: data.branch,
            name: data.name,
            course: data.course,
            year: data.year,
            schemeId: data.schemeId,
          };
        })
      );

      data.parentClasses = parentClasses;
    }

    await db.collection(MAPPING.CLASSROOMS).doc(data.id).set(data);

    const fieldPath = new FieldPath("classrooms", data.id);
    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.MASTER_CLASSROOMS)
      .update(fieldPath, data);

    const record = data;
    record.parentClasses = Object.keys(record.parentClasses);

    return { data: record, status: 200 };
  },

  delete: async (resource, params) => {
    const { id } = params;
    await db.collection(MAPPING.CLASSROOMS).doc(id).delete();

    const fieldPath = new FieldPath("classrooms", id);
    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.MASTER_CLASSROOMS)
      .update(fieldPath, FieldValue.delete());

    return { data: { id }, status: 200 };
  },

  deleteMany: async (resource, params) => {
    const { ids } = params;
    for (const id of ids) await dataProvider.delete(resource, { id });
    return { data: ids, status: 200 };
  },
};
