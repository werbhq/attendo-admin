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
export const TeachersProvider = {
  resource: MAPPING.TEACHERS,

  update: async (resource, params) => {
    const { id, data } = params;  

    console.log(id,data);
    console.log("whaa")
   
    // let newData = {...returnData};
    // console.log(newData,errorMessage,status);

    return { data: data, status: 200 };
  },

  getOne: async (resource, params) => {
    const { id, data } = params;

    let returnData = (await db
      .collection(resource)
      .doc(id)
      .get()).data();

      console.log(returnData)
      console.log("hey")

      if(returnData===undefined)
      {
        return {errorMessage: 'Cannot find user: ' + id, status: 404};
      }
      
    // console.log(returnData);

    return { returnData: returnData, status: 200 };
  },

  
};
