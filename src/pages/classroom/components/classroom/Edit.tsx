import { useEffect, useState } from 'react';
import {
    SimpleForm,
    SelectInput,
    useDataProvider,
    ReferenceArrayInput,
    AutocompleteArrayInput,
    useRecordContext,
    useNotify,
    useRefresh,
    Toolbar,
    SaveButton,
    DeleteButton,
} from 'react-admin';
import { MAPPING } from 'provider/mapping';
import { titleCase } from 'Utils/helpers';
import { Schemes } from 'Utils/Schemes';
import { Subject, SubjectDoc } from 'types/models/subject';
import { Batch } from 'types/models/batch';
import { defaultParams } from 'provider/firebase';
import { Classroom, ClassroomNonVirtual, ClassroomVirtual } from 'types/models/classroom';
import { AuthorizedTeacher, TeacherShort } from 'types/models/teacher';
import SK from 'pages/source-keys';
import GroupLink from './GroupLink';
import { Dialog } from '@mui/material';

type Props = {
    dialog: boolean;
    setDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const CURRENT_CLASS_ID = 'This Classroom';

const EditClassroom = ({
    schemes: schemeData,
    batchData,
    teacherData,
    state,
}: {
    schemes: SubjectDoc[];
    batchData: Batch[];
    teacherData: TeacherShort[];
    state: Props;
}) => {
    const record: Classroom & { parentClasses: string[] } = useRecordContext();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const { getBranches, getSemesters, getSubjects, isDerived } = new Schemes(schemeData);
    const [data, setData] = useState<{
        scheme: null | string;
        branch: null | string;
        name: null | string;
        group: null | string;
        semester: null | number;
        batch: null | string;
    }>({
        scheme: record.batch.schemeId,
        branch: record.branch,
        name: record.name,
        group: record.group,
        semester: record.semester ?? null,
        batch: record.batch.id,
    });

    const [groupDependency, setGroupDependency] = useState<{
        subjectId: string;
        parentClasses: string[];
    }>({
        subjectId: record.subjectId ?? '',
        parentClasses: record.parentClasses,
    });

    const batchChoices = batchData.map(({ name, id }) => ({ name, id }));

    const groupLinks = [
        { id: CURRENT_CLASS_ID, group: record.group },
        ...(record?.groupLinks ?? []),
    ];

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
            customValidatorArray(values, SK.CLASSROOM('teachers'));

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

    const onSubmit = async (props: any) => {
        const propRecord = props as Classroom;
        const batch = batchData.find((e) => e.id === propRecord.batch?.id) as Batch;
        propRecord.batch = batch;

        if (propRecord.groupLinks) {
            propRecord.group =
                propRecord.groupLinks.find((e) => e.id === CURRENT_CLASS_ID)?.group ?? null;
            propRecord.groupLinks = propRecord.groupLinks.filter((e) => e.id !== CURRENT_CLASS_ID);
        }

        const common = {
            id: propRecord.id,
            name: propRecord.name,
            group: propRecord.group ?? null,
            branch: propRecord.branch,
            batch,
            students: propRecord.students,
        };

        let finalData: ClassroomNonVirtual | ClassroomVirtual;

        if (!isDerived(propRecord.name)) {
            const nonVirtualClassroom: ClassroomNonVirtual = {
                ...common,
                isDerived: false,
                subjects: {},
            };
            finalData = nonVirtualClassroom;
        } else {
            const recordVirtual = propRecord as ClassroomVirtual & { teachers: string[] };
            const newTeachers = teacherData.filter((e) => recordVirtual.teachers.includes(e.id));

            const virtualClassroom: ClassroomVirtual = {
                ...common,
                isDerived: true,
                parentClasses: recordVirtual.parentClasses,
                groupLinks: propRecord.groupLinks ?? [],
                subject: getSubjects(data.scheme, data.branch, data.semester).find(
                    (e) => e.id === propRecord.subjectId
                ) as Subject,
                subjectId: recordVirtual.subjectId,
                teachers: newTeachers,
                semester: recordVirtual.semester,
            };
            finalData = virtualClassroom;
        }

        await dataProvider.update<Classroom>(MAPPING.CLASSROOMS, {
            id: finalData.id,
            data: finalData,
            previousData: record,
        });

        refresh();
        notify(`Edited ${finalData.id}`, { type: 'success' });
        state.setDialog(false);
    };

    return (
        <Dialog open={state.dialog} onClose={() => state.setDialog(false)} fullWidth={true}>
            <SimpleForm
                style={{ alignItems: 'stretch' }}
                validate={validateClassroom}
                onSubmit={onSubmit}
                record={record}
                toolbar={
                    <Toolbar sx={{ justifyContent: 'space-between', display: 'flex' }}>
                        <SaveButton alwaysEnable />
                        <DeleteButton />
                    </Toolbar>
                }
            >
                <SelectInput
                    source={SK.CLASSROOM('batch.id')}
                    label="Batch Name"
                    choices={batchChoices}
                    onChange={(e) => changeBatch(e.target.value)}
                    required
                    disabled={true}
                />
                <SelectInput
                    source={SK.CLASSROOM('branch')}
                    choices={getBranches(data.scheme)}
                    onChange={(e) => setData({ ...data, branch: e.target.value })}
                    required
                    disabled={true}
                />
                <SelectInput
                    source={SK.CLASSROOM('name')}
                    choices={data.branch ? Schemes.classNames : []}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    required
                    disabled={true}
                />

                {isDerived(data.name) && (
                    <>
                        <SelectInput
                            source={SK.CLASSROOM('semester')}
                            choices={getSemesters(data.scheme)}
                            onChange={(e) => setData({ ...data, semester: e.target.value })}
                            required
                            disabled={true}
                        />

                        <SelectInput
                            source={SK.CLASSROOM('subjectId')}
                            choices={
                                data.semester
                                    ? getSubjects(data.scheme, data.branch, data.semester)
                                    : []
                            }
                            onChange={(e) =>
                                setGroupDependency((v) => ({ ...v, subjectId: e.target.value }))
                            }
                            disabled={true}
                            required
                        />

                        <ReferenceArrayInput
                            source={SK.CLASSROOM('parentClasses')}
                            reference={MAPPING.CLASSROOMS}
                            filter={{
                                isDerived: false,
                                branch: data.branch,
                                batch: batchData.find((e) => e.id === data.batch),
                            }}
                            disabled={true}
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
                                disabled={true}
                            />
                        </ReferenceArrayInput>

                        <GroupLink
                            currentClassId={record.id}
                            currentClassIdAlias={CURRENT_CLASS_ID}
                            subjectId={groupDependency.subjectId}
                            parentClasses={groupDependency.parentClasses}
                            data={data}
                            groupLinksData={groupLinks}
                        />

                        <ReferenceArrayInput
                            source={SK.CLASSROOM('teachers')}
                            reference={MAPPING.AUTH_TEACHERS}
                            filter={{ created: true }}
                        >
                            <AutocompleteArrayInput
                                optionText={SK.AUTH_TEACHERS('userName')}
                                source={SK.AUTH_TEACHERS('userName')}
                                filterToQuery={(searchText) => ({ username: searchText })}
                                isRequired
                            />
                        </ReferenceArrayInput>
                    </>
                )}
            </SimpleForm>
        </Dialog>
    );
};

const ClassroomsEdit = ({ state }: { state: Props }) => {
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
                <EditClassroom
                    schemes={schemeData}
                    batchData={batchData}
                    teacherData={teachers}
                    state={state}
                />
            )}
        </>
    );
};

export default ClassroomsEdit;
