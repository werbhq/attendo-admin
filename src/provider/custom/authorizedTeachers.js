import { httpsCallable } from "firebase/functions";
import { sorter } from "../../Utils/helpers";
import {
  cloudFunctions,
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
export const AuthTeachersProvider = {
  resource: MAPPING.AUTH_TEACHERS,

  getList: async (resource, params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.AUTH_TEACHERS,
    });

    const values = Object.values(data.teachers);
    return { data: sorter(params, values), total: values.length, status: 200 };
  },

  getOne: async (resource, params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.AUTH_TEACHERS,
    });
    return { data: data.teachers[params.id], status: 200 };
  },

  update: async (resource, params) => {
    const { id, data } = params;
    console.log(params);

    const fieldPath = new FieldPath("teachers", id);
    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.AUTH_TEACHERS)
      .update(fieldPath, data);

    return { data, status: 200 };
  },

  updateMany: async (resource, params) => {
    const { ids, data } = params;

    if (data !== undefined && data.length !== 0) {
      let index = 0;
      for (const id of ids) {
        console.log(data[index]);
        const dataInstance = data[index++];
        console.log(dataInstance);

        dataProvider.update(resource, { id: id, data: dataInstance });
      }
    }
    return { data, status: 200 };
  },

  delete: async (resource, params) => {
    const { id } = params;

    const fieldPath = new FieldPath("teachers", id);
    await db
      .collection(MAPPING.DATA)
      .doc(MAPPING.AUTH_TEACHERS)
      .update(fieldPath, FieldValue.delete());

    return { data: { id }, status: 200 };
  },

  deleteMany: async (resource, params) => {
    const { ids } = params;
    for (const id of ids) await dataProvider.delete(resource, { id });
    return { data: ids, status: 200 };
  },

  createEmails: async (selectedIds) => {
    const createAccountApi = httpsCallable(cloudFunctions, "createAccounts");
    const response = await (await createAccountApi(selectedIds)).data;
    return response;
  },
};
