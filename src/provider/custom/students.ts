import { DataProviderCustom } from '../../types/DataProvider';
import { Student } from '../../types/models/student';
import { db, FieldPath } from '../firebase';
import { MAPPING } from '../mapping';

/**
 * Don't call this directly
 * Use dataProvider
 */
export const StudentsProvider: DataProviderCustom<Student[]> = {
    resource: MAPPING.STUDENTS,

    update: async (resource, params) => {
        const { id, data, meta } = params;
        const { record } = meta;
        await db.runTransaction(async (transaction) => {
            const doc = db.collection(MAPPING.CLASSROOMS).doc(id as string);
            transaction.update(doc, { students: data });

            const fieldPath = new FieldPath('classrooms', id as string, 'students');
            await db
                .collection(MAPPING.DATA)
                .doc(MAPPING.MASTER_CLASSROOMS)
                .update(fieldPath, data);
        });
        return { data: { id, ...record }, status: 200 };
    },

    updateMany: async (resource, params) => {
        const { data, meta } = params;
        const { classId } = meta;
        await db.runTransaction(async (transaction) => {
            const doc = db.collection(MAPPING.CLASSROOMS).doc(classId);
            transaction.update(doc, { students: data });

            const fieldPath = new FieldPath('classrooms', classId, 'students');
            await db
                .collection(MAPPING.DATA)
                .doc(MAPPING.MASTER_CLASSROOMS)
                .update(fieldPath, data);
        });
        return { data, status: 200 };
    },
};
