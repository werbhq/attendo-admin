import {
  FirebaseAuthProvider,
  FirebaseDataProvider,
} from "react-admin-firebase";
import { MAPPING } from "./mapping";
import config from "./config.json";
import { ClassroomProvider as classroomProvider } from "./custom/classroom";
import { studentsProvider } from "./custom/students";

const options = {};

export const dataProviderLegacy = FirebaseDataProvider(config, options);
export const authProvider = FirebaseAuthProvider(config, options);
export const db = dataProviderLegacy.app.firestore();

const DataProviderCustom = {
  getList: async (resource, params) => {
    if (resource === MAPPING.SUBJECT) return studentsProvider.getList(params);
    return dataProviderLegacy.getList(resource, params);
  },

  getOne: async (resource, params) => {
    if (resource === MAPPING.SUBJECT) return studentsProvider.getOne(params);
    return dataProviderLegacy.getOne(resource, params);
  },

  update: async (resource, params) => {
    if (resource === MAPPING.CLASSROOMS)
      return classroomProvider.update(params);

    if (resource === MAPPING.STUDENTS) return studentsProvider.update(params);

    return dataProviderLegacy.update(resource, params);
  },

  updateMany: async (resource, params) => {
    if (resource === MAPPING.STUDENTS)
      return studentsProvider.updateMany(params);

    return dataProviderLegacy.updateMany(resource, params);
  },

  create: async (resource, params) => {
    if (resource === MAPPING.CLASSROOMS)
      return classroomProvider.create(params, db);

    return dataProviderLegacy.create(resource, params);
  },
};

export const dataProvider = {
  ...dataProviderLegacy,
  ...DataProviderCustom,
};
