import { DataProviderCustom } from 'types/DataProvider';
import { StudentShort } from 'types/models/student';
import { FieldValue } from '../firebase';
import { MAPPING } from '../mapping';
import { Classroom } from 'types/models/classroom';

/**
 * Don't call this directly
 * Use dataProvider
 */
const StudentsProvider: DataProviderCustom<StudentShort[]> = {
    resource: MAPPING.STUDENTS,

    update: async (resource, params, providers) => {
        const { id, data, meta } = params;
        const { record } = meta;
        const { dataProviderCustom } = providers;
        const firestore = dataProviderCustom.app.firestore();

        const studentMap: Classroom['students'] = {};
        data.forEach((e) => {
            studentMap[e?.id as string] = e as StudentShort;
        });

        await firestore
            .collection(MAPPING.CLASSROOMS)
            .doc(id as string)
            .update({ students: studentMap, 'meta.lastUpdated': FieldValue.serverTimestamp() });

        return { data: { id, ...record }, status: 200 };
    },

    updateMany: async (resource, params, providers) => {
        const { data, meta } = params;
        const { classId } = meta;
        const { dataProviderCustom } = providers;
        const firestore = dataProviderCustom.app.firestore();
        const studentMap: Classroom['students'] = {};
        data.forEach((e) => {
            studentMap[e?.id as string] = e as StudentShort;
        });
        await firestore
            .collection(MAPPING.CLASSROOMS)
            .doc(classId as string)
            .update({ students: studentMap, 'meta.lastUpdated': FieldValue.serverTimestamp() });

        return { data, status: 200 };
    },
};

export default StudentsProvider;
