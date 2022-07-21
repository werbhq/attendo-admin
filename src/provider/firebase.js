import {
  FirebaseAuthProvider,
  FirebaseDataProvider,
} from "react-admin-firebase";
import config from "./config.json";
import CustomProviders from "./customProviders";
import firebase from "firebase/compat/app";
import { getFunctions } from "firebase/functions";
export const FieldValue = firebase.firestore.FieldValue;
export const FieldPath = firebase.firestore.FieldPath;

const options = {};

export const dataProviderLegacy = FirebaseDataProvider(config, options);
export const authProvider = FirebaseAuthProvider(config, options);
export const db = dataProviderLegacy.app.firestore();
export const cloudFunctions = getFunctions();

const getCustomConvertor = async (resource, params, method) => {
  const provider = CustomProviders.find((e) => e.resource === resource);
  if (provider) {
    if (provider[method]) return provider[method](resource, params);
    else console.error(`${method}() Not Implemented For ${resource}`);
  }
  return dataProviderLegacy[method](resource, params);
};

const DataProviderCustom = {
  /**
   * @param {string} resource
   * @param {import("react-admin").CreateParams} params
   * @returns {Promise<import("react-admin").CreateResult>}
   * */
  create: async (resource, params) =>
    getCustomConvertor(resource, params, "create"),

  /**
   * @param {string} resource
   * @param {import("react-admin").CreateParams} params
   * @returns {Promise<import("react-admin").DeleteResult>}
   * */
  delete: async (resource, params) =>
    getCustomConvertor(resource, params, "delete"),

  /**
   * @param {string} resource
   * @param {import("react-admin").CreateParams} params
   * @returns {Promise<import("react-admin").DeleteManyResult>}
   * */
  deleteMany: async (resource, params) =>
    getCustomConvertor(resource, params, "deleteMany"),

  /**
   * @param {string} resource
   * @param {import("react-admin").ListParams} params
   * @returns {Promise<import("react-admin").GetListResult>}
   * */
  getList: async (resource, params) =>
    getCustomConvertor(resource, params, "getList"),

  /**
   * @param {string} resource
   * @param {import("react-admin").GetOneParams} params
   * @returns {Promise<import("react-admin").GetOneResult>}
   * */
  getOne: async (resource, params) =>
    getCustomConvertor(resource, params, "getOne"),

  /**
   * @param {string} resource
   * @param {import("react-admin").GetManyParams} params
   * @returns {Promise<import("react-admin").GetManyResult>}
   * */
  getMany: async (resource, params) =>
    getCustomConvertor(resource, params, "getMany"),

  /**
   * @param {string} resource
   * @param {import("react-admin").GetManyReferenceParams} params
   * @returns {Promise<import("react-admin").GetManyReferenceResult>}
   * */
  getManyReference: async (resource, params) =>
    getCustomConvertor(resource, params, "getManyReference"),

  /**
   * @param {string} resource
   * @param {import("react-admin").UpdateParams} params
   * @returns {Promise<import("react-admin").UpdateResult>}
   * */
  update: async (resource, params) =>
    getCustomConvertor(resource, params, "update"),

  /**
   * @param {string} resource
   * @param {import("react-admin").UpdateManyParams} params
   * @returns {Promise<import("react-admin").UpdateResult>}
   * */
  updateMany: async (resource, params) =>
    getCustomConvertor(resource, params, "updateMany"),
};

export const dataProvider = DataProviderCustom;
