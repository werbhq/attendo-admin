import {
  FirebaseAuthProvider,
  FirebaseDataProvider,
} from "react-admin-firebase";
import config from "./config.json";
import CustomProviders from "./customProviders";
import firebase from 'firebase/compat/app';

const options = {};

export const dataProviderLegacy = FirebaseDataProvider(config, options);
export const authProvider = FirebaseAuthProvider(config, options);
export const db = dataProviderLegacy.app.firestore();
export const FieldValue = firebase.firestore.FieldValue;

const getCustomConvertor = async (resource, params, method) => {
  const provider = CustomProviders.find(
    (e) => e.resource === resource && e[method]
  );
  if (provider) return provider[method](resource, params);
  return dataProviderLegacy[method](resource, params);
};

const DataProviderCustom = {
  create: async (resource, params) =>
    getCustomConvertor(resource, params, "create"),

  delete: async (resource, params) =>
    getCustomConvertor(resource, params, "delete"),

  deleteMany: async (resource, params) =>
    getCustomConvertor(resource, params, "deleteMany"),

  getList: async (resource, params) =>
    getCustomConvertor(resource, params, "getList"),

  getOne: async (resource, params) =>
    getCustomConvertor(resource, params, "getOne"),

  getMany: async (resource, params) =>
    getCustomConvertor(resource, params, "getMany"),

  getManyReference: async (resource, params) =>
    getCustomConvertor(resource, params, "getManyReference"),

  update: async (resource, params) =>
    getCustomConvertor(resource, params, "update"),

  updateMany: async (resource, params) =>
    getCustomConvertor(resource, params, "updateMany"),
};

export const dataProvider = DataProviderCustom;
