import { useEffect, useState } from 'react';
import {
    Create,
    SimpleForm,
    SelectInput,
    useDataProvider,
    ReferenceArrayInput,
    AutocompleteArrayInput,
} from 'react-admin';
import { MAPPING } from 'provider/mapping';
import { getClassroomId } from 'Utils/helpers';
import { Schemes } from 'Utils/Schemes';
import { Subject, SubjectDoc } from 'types/models/subject';
import { Batch } from 'types/models/batch';
import { defaultParams } from 'provider/firebase';
import { Classroom, ClassroomNonVirtual, ClassroomVirtual } from 'types/models/classroom';
import { AuthorizedTeacher, TeacherShort } from 'types/models/teacher';

import SK from 'pages/source-keys';
import GroupLink from './components/classroom/GroupLink';

const CURRENT_CLASS_ID = 'This Classroom';

const CreateClassroom = ({
    schemes: schemeData,
    batchData,
    teacherData,
}: {
    schemes: SubjectDoc[];
    batchData: Batch[];
    teacherData: TeacherShort[];
}) => {
    const { getBranches, getSemesters, getSubjects, isDerived } = new Schemes(schemeData);
    const [data, setData] = useState<{
        scheme: null | string;
        branch: null | string;
        name: null | string;
        group: null | string;
        semester: null | number;
        batchId: null | string;
    }>({
        scheme: null,
        branch: null,
        name: null,
        group: null,
        semester: null,
        batchId: null,
    });

    const [groupDependency, setGroupDependency] = useState<{
        subjectId: string;
        parentClasses: string[];
    }>({ subjectId: '', parentClasses: [] });

    const batchChoices = batchData.map(({ name, id }) => ({ name, id }));

    function changeBatch(batchId: string) {
        const batch = batchData.find((e) => e.id === batchId);

        if (isDerived(data.name)) {
            setData({
                ...data,
                scheme: batch?.schemeId ?? null,
                batchId,
            });
        } else {
            setData({
                ...data,
                scheme: batch?.schemeId ?? null,
                semester: batch?.semester ?? null,
                batchId,
            });
        }
    }

    const validateClassroom = (values: any) => {
        const errors: { [index: string]: string } = {};
        const id = (e: { id: string }) => e.id;

        const customValidator = (data: any[], fieldName: string) => {
            if (!data.map(id).includes(values[fieldName as keyof Classroom])) {
                errors[fieldName] = 'ra.validation.required';
            }
        };

        const customValidatorArray = (data: any, fieldName: string) => {
            if (data[fieldName]?.length === 0) {
                errors[fieldName] = 'ra.validation.required';
            }
        };

        customValidator(getBranches(data.scheme), SK.CLASSROOM('branch'));
        customValidator(Schemes.classNames, SK.CLASSROOM('name'));

        if (isDerived(values.name)) {
            customValidator(getSemesters(data.scheme), SK.CLASSROOM('semester'));
            customValidator(
                getSubjects(data.scheme, data.branch, data.semester),
                SK.CLASSROOM('subjectId')
            );
            customValidatorArray(values, SK.CLASSROOM('parentClasses'));

            if (values[SK.CLASSROOM('groupLinks')]) {
                const groupSet = new Set();

                (values[SK.CLASSROOM('groupLinks')] as Classroom['groupLinks'])?.forEach(
                    ({ group }) => {
                        if (groupSet.has(group))
                            errors['groupLinks'] = 'Group names must be unique';
                        else groupSet.add(group);
                    }
                );
            }
        }
        return errors;
    };

    const transformSubmit = (props: any) => {
        const record = props as Classroom;
        const batch = batchData.find((e) => e.id === record.batch?.id) as Batch;
        record.batch = batch;

        const classroomId = getClassroomId(record, isDerived(record.name));

        if (record.groupLinks) {
            record.group = record.groupLinks.find((e) => e.id === CURRENT_CLASS_ID)?.group ?? null;
            record.groupLinks = record.groupLinks.filter((e) => e.id !== CURRENT_CLASS_ID);
        }

        const common = {
            id: classroomId,
            name: record.name,
            group: record.group ?? null,
            branch: record.branch,
            batch,
            students: {},
        };

        let finalData: ClassroomNonVirtual | ClassroomVirtual;

        if (!isDerived(record.name)) {
            const nonVirtualClassroom: ClassroomNonVirtual = {
                ...common,
                isDerived: false,
                subjects: {},
            };
            finalData = nonVirtualClassroom;
        } else {
            const recordVirtual = record as ClassroomVirtual & { teachers: string[] };
            const newTeachers = teacherData.filter((e) => recordVirtual.teachers.includes(e.id));

            const virtualClassroom: ClassroomVirtual = {
                ...common,
                isDerived: true,
                parentClasses: recordVirtual.parentClasses,
                groupLinks: record.groupLinks ?? [],
                subject: getSubjects(data.scheme, data.branch, data.semester).find(
                    (e) => e.id === record.subjectId
                ) as Subject,
                subjectId: recordVirtual.subjectId,
                teachers: newTeachers,
                semester: recordVirtual.semester,
            };
            finalData = virtualClassroom;
        }

        return finalData;
    };

    return (
        <Create transform={transformSubmit}>
            <SimpleForm style={{ alignItems: 'stretch' }} validate={validateClassroom}>
                <SelectInput
                    source={SK.CLASSROOM('batch.id')}
                    label="Batch Name"
                    choices={batchChoices}
                    onChange={(e) => changeBatch(e.target.value)}
                    required
                />
                <SelectInput
                    source={SK.CLASSROOM('branch')}
                    choices={getBranches(data.scheme)}
                    onChange={(e) => setData({ ...data, branch: e.target.value })}
                    required
                />
                <SelectInput
                    source={SK.CLASSROOM('name')}
                    choices={data.branch ? Schemes.classNames : []}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    required
                />

                {isDerived(data.name) && (
                    <>
                        <SelectInput
                            source={SK.CLASSROOM('semester')}
                            choices={getSemesters(data.scheme)}
                            onChange={(e) => setData({ ...data, semester: e.target.value })}
                            required
                        />

                        <SelectInput
                            source={SK.CLASSROOM('subjectId')}
                            choices={
                                data.semester
                                    ? getSubjects(data.scheme, data.branch, data.semester)
                                    : []
                            }
                            disabled={
                                getSubjects(data.scheme, data.branch, data.semester).length === 0
                                    ? true
                                    : false
                            }
                            onChange={(e) =>
                                setGroupDependency((v) => ({ ...v, subjectId: e.target.value }))
                            }
                            required
                        />

                        <ReferenceArrayInput
                            source={SK.CLASSROOM('parentClasses')}
                            reference={MAPPING.CLASSROOMS}
                            filter={{
                                isDerived: false,
                                branch: data.branch,
                                batch: batchData.find((e) => e.id === data.batchId),
                            }}
                        >
                            <AutocompleteArrayInput
                                optionText="id"
                                source={SK.CLASSROOM('id')}
                                filterToQuery={(searchText) => ({ id: searchText })}
                                onChange={(e) =>
                                    setGroupDependency((v) => ({
                                        ...v,
                                        parentClasses: e,
                                    }))
                                }
                                isRequired
                            />
                        </ReferenceArrayInput>

                        <GroupLink
                            subjectId={groupDependency.subjectId}
                            parentClasses={groupDependency.parentClasses}
                            data={data}
                            currentClassIdAlias={CURRENT_CLASS_ID}
                        />

                        <ReferenceArrayInput
                            source={SK.CLASSROOM('teachers')}
                            reference={MAPPING.AUTH_TEACHERS}
                            filter={{ created: true }}
                        >
                            <AutocompleteArrayInput
                                optionText={SK.AUTH_TEACHERS('userName')}
                                source={SK.AUTH_TEACHERS('userName')}
                                filterToQuery={(searchText) => ({ userName: searchText })}
                            />
                        </ReferenceArrayInput>
                    </>
                )}
            </SimpleForm>
        </Create>
    );
};

const ClassroomsCreate = () => {
    const dataProvider = useDataProvider();
    const [schemeData, setData] = useState<SubjectDoc[]>([]);
    const [teachers, setTeachers] = useState<TeacherShort[]>([]);
    const [batchData, setBatchData] = useState<Batch[]>([]);

    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        dataProvider.getList<AuthorizedTeacher>(MAPPING.AUTH_TEACHERS, defaultParams).then((e) => {
            const teacherData = e.data
                .filter((e) => e.created)
                .map(({ id, email, userName }) => ({
                    id,
                    emailId: email,
                    name: userName,
                }));
            setTeachers(teacherData);
        });

        dataProvider.getList<Batch>(MAPPING.BATCHES, defaultParams).then((e) => {
            setBatchData(e.data);
        });

        dataProvider
            .getList<SubjectDoc>(MAPPING.SUBJECT, defaultParams)
            .then((e) => setData(e.data));
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {loading ? (
                <></>
            ) : (
                <CreateClassroom
                    schemes={schemeData}
                    batchData={batchData}
                    teacherData={teachers}
                />
            )}
        </>
    );
};

export default ClassroomsCreate;
