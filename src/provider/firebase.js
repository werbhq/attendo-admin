import {
  FirebaseAuthProvider,
  FirebaseDataProvider,
} from "react-admin-firebase";
import configProd from "./config/prod.json";
import configDev from "./config/dev.json";
import CustomProviders from "./customProviders";
import firebase from "firebase/compat/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
export const FieldValue = firebase.firestore.FieldValue;
export const FieldPath = firebase.firestore.FieldPath;

const options = {};
const kMode = "prod"; // dev, prod, emulate

export const dataProviderLegacy =
  kMode === "prod" || process.env.NODE_ENV === "production"
    ? FirebaseDataProvider(configProd, options)
    : FirebaseDataProvider(configDev, options);

export const authProvider =
  kMode === "prod" || process.env.NODE_ENV === "production"
    ? FirebaseAuthProvider(configProd, options)
    : FirebaseAuthProvider(configDev, options);

export const db = dataProviderLegacy.app.firestore();
export const cloudFunctions = getFunctions();

if (kMode === "emulate" && process.env.NODE_ENV !== "production") {
  firebase.firestore().useEmulator("localhost", 8090);
  connectFunctionsEmulator(cloudFunctions, "localhost", 5001);
  firebase.auth().useEmulator("http://localhost:9099/");
  //firebase.storage().useEmulator("localhost", 9199);
}

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
