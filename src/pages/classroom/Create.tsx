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
import { getClassroomId, titleCase } from 'Utils/helpers';
import { Schemes } from 'Utils/Schemes';
import { Subject, SubjectDoc } from 'types/models/subject';
import { Batch } from 'types/models/batch';
import { defaultParams } from 'provider/firebase';
import { Classroom, ClassroomNonVirtual, ClassroomVirtual } from 'types/models/classroom';
import { AuthorizedTeacher, TeacherShort } from 'types/models/teacher';

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
        course: null | string;
        scheme: null | string;
        branch: null | string;
        name: null | string;
        semester: null | number;
        batch: null | string;
    }>({
        course: null,
        scheme: null,
        branch: null,
        name: null,
        semester: null,
        batch: null,
    });
    const batchChoices = batchData.map(({ name, id }) => ({ name, id }));

    function changeBatch(batchId: string) {
        const batch = batchData.find((e) => e.id === batchId);

        if (isDerived(data.name)) {
            setData({
                ...data,
                scheme: batch?.schemeId ?? null,
                batch: batchId,
            });
        } else {
            setData({
                ...data,
                scheme: batch?.schemeId ?? null,
                semester: batch?.semester ?? null,
                batch: batchId,
            });
        }
    }

    const validateClassroom = (values: any) => {
        const errors: { [index: string]: string } = {};
        const id = (e: Classroom) => e.id;

        const customValidator = (data: any[], fieldName: string) => {
            if (!data.map(id).includes(values[fieldName])) {
                errors[fieldName] = 'ra.validation.required';
            }
        };

        customValidator(getBranches(data.scheme), 'branch');
        customValidator(Schemes.classNames, 'name');
        if (isDerived(values.name)) {
            customValidator(getSemesters(data.scheme), 'semester');
            customValidator(getSubjects(data.scheme, data.branch, data.semester), 'subjectId');
        }
        return errors;
    };

    const transformSubmit = (props: any) => {
        const record = props as Classroom;
        const batch = batchData.find((e) => e.id === record.batch?.id) as Batch;
        record.batch = batch;

        const classroomId = getClassroomId(record, isDerived(record.name));

        const common = {
            id: classroomId,
            name: record.name,
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
            const recordVirtual = record as ClassroomVirtual; // type casting

            const selectedTeachers = recordVirtual.teachers.map((e) => e.id) ?? [];
            const newTeachers = teacherData.filter((e) => selectedTeachers.includes(e.id));

            const virtualClassroom: ClassroomVirtual = {
                ...common,
                isDerived: true,
                parentClasses: recordVirtual.parentClasses,
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
                    source="batch.id"
                    label="Batch Name"
                    choices={batchChoices}
                    onChange={(e) => changeBatch(e.target.value)}
                    required
                />
                <SelectInput
                    source="branch"
                    choices={getBranches(data.scheme)}
                    onChange={(e) => setData({ ...data, branch: e.target.value })}
                    required
                />
                <SelectInput
                    source="name"
                    choices={data.branch ? Schemes.classNames : []}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    required
                />
                {isDerived(data.name) && (
                    <>
                        <SelectInput
                            source="semester"
                            choices={getSemesters(data.scheme)}
                            onChange={(e) => setData({ ...data, semester: e.target.value })}
                            required
                        />
                        <SelectInput
                            source="subjectId"
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
                            required
                        />
                        <ReferenceArrayInput
                            source="parentClasses"
                            reference={MAPPING.CLASSROOMS}
                            filter={{ isDerived: false, branch: data.branch }}
                        >
                            <AutocompleteArrayInput
                                optionText="id"
                                source="id"
                                filterToQuery={(searchText) => ({ id: searchText })}
                                isRequired
                            />
                        </ReferenceArrayInput>
                        <AutocompleteArrayInput
                            source="teachers"
                            parse={(value) => value && value.map((v: TeacherShort) => ({ id: v }))}
                            format={(value) => value && value.map((v: TeacherShort) => v.id)}
                            choices={teacherData.map((e) => ({ id: e.id, name: e.name }))}
                            optionText={(choice) => `${titleCase(choice.name)}`}
                            filterToQuery={(searchText) => ({ id: searchText })}
                            emptyText="No Option"
                            sx={{ minWidth: 300 }}
                            isRequired
                        />
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
            const teacherData = e.data.map(({ id, email, userName }) => ({
                id,
                emailId: email,
                name: titleCase(userName),
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
