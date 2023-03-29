import { DataProviderCustom } from 'types/DataProvider';
import {
    Classroom,
    ClassroomNonVirtualShort,
    ClassroomToClassroomShort,
} from 'types/models/classroom';
import { dataProvider, db } from '../firebase';
import { MAPPING } from '../mapping';

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
                          parentClasses[data.id] = ClassroomToClassroomShort(
                              data
                          ) as ClassroomNonVirtualShort;
                      })
                    : []
            );

            data.parentClasses = parentClasses;
            delete data.subjects;
        } else {
            delete data.parentClasses;
            delete data.subject;
            delete data.teachers;
            delete data.semester;
            delete data.groupLinks;
            delete data.subjectId;
        }

        const ref = db.collection(MAPPING.CLASSROOMS);
        const promises = [ref.doc(data.id).update({ ...data })];

        if (data.groupLinks) {
            data.groupLinks.forEach(({ id: cId, group }) => {
                promises.push(
                    ref.doc(cId).update({
                        group,
                        groupLinks: [
                            {
                                id: data.id,
                                group: data.group,
                            },
                            ...(data.groupLinks?.filter((e) => e.id !== cId) ?? []),
                        ],
                    })
                );
            });
        }

        await Promise.all(promises);

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

                        parentClasses[data.id] = parentClasses[data.id] = ClassroomToClassroomShort(
                            data
                        ) as ClassroomNonVirtualShort;
                    })
                );
            }

            data.parentClasses = parentClasses;
            delete data.subjects;
        } else {
            delete data.parentClasses;
            delete data.subject;
            delete data.teachers;
            delete data.semester;
            delete data.groupLinks;
            delete data.subjectId;
        }

        const ref = db.collection(MAPPING.CLASSROOMS);
        const promises = [ref.doc(data.id).set(data)];

        if (data.groupLinks) {
            data.groupLinks.forEach(({ id: cId, group }) => {
                promises.push(
                    ref.doc(cId).update({
                        group,
                        groupLinks: [
                            {
                                id: data.id,
                                group: data.group,
                            },
                            ...(data.groupLinks?.filter((e) => e.id !== cId) ?? []),
                        ],
                    })
                );
            });
        }

        await Promise.all(promises);

        return { data, status: 200 };
    },
};

export default ClassroomProvider;
