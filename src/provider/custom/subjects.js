import { dataProviderLegacy, db } from "../firebase";
import { MAPPING } from "../mapping";

/**
 * Don't call this directly
 * Use dataProvider
 */
export const SubjectsProvider = {
  resource: MAPPING.SUBJECT,

  getList: async (resource, params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.SUBJECT,
    });
    const values = Object.values(data.schemes);
    return { data: values, total: values.length };
  },

  getOne: async (resource, params) => {
    const { data } = await dataProviderLegacy.getOne(MAPPING.DATA, {
      id: MAPPING.SUBJECT,
    });
    return { data: data.schemes[params.id] };
  },

  update: async (resource, params) => {
    const { id, data } = params;
    const updateValue = {};
    updateValue["schemes.".concat(id)] = data;

    // await db.collection(MAPPING.DATA).doc(resource).update({
    //   "schemes.id" : data
    // });

    // await db
    //   .collection(MAPPING.DATA)
    //   .doc("TEST")
    //   .set({
    //     schemes: {
    //       "BTECH-MBCET-2020": {
    //         id: "BTECH-MBCET-2020",
    //         course: "BTECH",
    //         organization: "MBCET",
    //         year: 2020,
    //       },
    //       "BTECH-MBCET-2015": {},
    //       "BTECH-KTU-2015": {},
    //     },
    //   });

    await db
      .collection(MAPPING.DATA)
      .doc("TEST")
      .update(updateValue);

      // await db
      // .collection(MAPPING.DATA)
      // .doc("TEST")
      // .delete();



  },
};
