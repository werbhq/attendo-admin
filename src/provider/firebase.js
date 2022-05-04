import {
  FirebaseAuthProvider,
  FirebaseDataProvider,
} from "react-admin-firebase";
import { MAPPING } from "./mapping";
import config from "./config.json";
import { ClassroomProvider } from "./custom/classroom";
import { StudentsProvider } from "./custom/students";
import { SubjectsProvider } from "./custom/subjects";
import { SemestersProvider } from "./custom/semesters";

const options = {};

export const dataProviderLegacy = FirebaseDataProvider(config, options);
export const authProvider = FirebaseAuthProvider(config, options);
export const db = dataProviderLegacy.app.firestore();

const DataProviderCustom = {
  getList: async (resource, params) => {
    if (resource === MAPPING.SUBJECT) return SubjectsProvider.getList(params);

    if (resource === MAPPING.SEMESTERS)
      return SemestersProvider.getList(params);

    if (resource === MAPPING.CLASSROOMS)
      return ClassroomProvider.getList(resource, params);

    return dataProviderLegacy.getList(resource, params);
  },

  getOne: async (resource, params) => {
    if (resource === MAPPING.SUBJECT) return SubjectsProvider.getOne(params);
    if (resource === MAPPING.SEMESTERS) return SemestersProvider.getOne(params);
    if (resource === MAPPING.CLASSROOMS)
      return ClassroomProvider.getOne(resource, params);

    return dataProviderLegacy.getOne(resource, params);
  },

  update: async (resource, params) => {
    if (resource === MAPPING.CLASSROOMS)
      return ClassroomProvider.update(params);

    if (resource === MAPPING.STUDENTS) return StudentsProvider.update(params);

    return dataProviderLegacy.update(resource, params);
  },

  updateMany: async (resource, params) => {
    if (resource === MAPPING.STUDENTS)
      return StudentsProvider.updateMany(params);

    return dataProviderLegacy.updateMany(resource, params);
  },

  create: async (resource, params) => {
    if (resource === MAPPING.CLASSROOMS)
      return ClassroomProvider.create(params, db);

    return dataProviderLegacy.create(resource, params);
  },
};

export const dataProvider = {
  ...dataProviderLegacy,
  ...DataProviderCustom,
};
