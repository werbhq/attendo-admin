import { DataProviderCustom } from 'types/DataProvider';
import { Classroom, ClassroomNonVirtualShort } from 'types/models/classroom';
import { dataProvider, db } from '../firebase';
import { MAPPING } from '../mapping';

const getClassroomShort = (data: Classroom) => {
    return {
        id: data.id,
        branch: data.branch,
        name: data.name,
        batch: {
            course: data.batch.course,
            yearOfJoining: data.batch.yearOfJoining,
            id: data.batch.id,
            name: data.batch.name,
            schemeId: data.batch.schemeId,
        },
    };
};

/**
 * Don't call this directly
 * Use dataProvider
 */
const ClassroomProvider: DataProviderCustom<Classroom> = {
    resource: MAPPING.CLASSROOMS,

    update: async (resource, params) => {
        const { id, data } = params;

        if (data.isDerived) {
            const parentClasses: { [classId: string]: ClassroomNonVirtualShort } = {};
            await Promise.all(
                Array.isArray(data.parentClasses)
                    ? data.parentClasses.map(async (e) => {
                          const { data } = await dataProvider.getOne<Classroom>(resource, {
                              id: e,
                          });
                          parentClasses[data.id] = getClassroomShort(data);
                      })
                    : []
            );

            data.parentClasses = parentClasses;
        }

        await db
            .collection(MAPPING.CLASSROOMS)
            .doc(id as string)
            .update({ ...data });

        return { data: { ...data, id }, status: 200 };
    },

    create: async (resource, params) => {
        const { data } = params;

        const { exists: documentExists } = await db
            .collection(MAPPING.CLASSROOMS)
            .doc(data.id)
            .get();

        if (documentExists) throw new Error(`${data.id} classroom already exists`);

        if (data.isDerived) {
            const parentClasses: { [classId: string]: ClassroomNonVirtualShort } = {};

            if (Array.isArray(data.parentClasses)) {
                await Promise.all(
                    data.parentClasses.map(async (e) => {
                        const { data } = await dataProvider.getOne<Classroom>(resource, {
                            id: e,
                        });

                        parentClasses[data.id] = parentClasses[data.id] = getClassroomShort(data);
                    })
                );
            }

            data.parentClasses = parentClasses;
        }

        await db.collection(MAPPING.CLASSROOMS).doc(data.id).set(data);

        return { data, status: 200 };
    },
};

export default ClassroomProvider;
