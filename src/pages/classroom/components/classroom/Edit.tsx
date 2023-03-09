import {
    SimpleForm,
    useDataProvider,
    useRecordContext,
    useRefresh,
    useNotify,
    SaveButton,
    SelectInput,
    DeleteWithConfirmButton,
    useRedirect,
    AutocompleteArrayInput,
    ReferenceArrayInput,
    GetListResult,
} from 'react-admin';
import { MAPPING } from 'provider/mapping';
import { Stack, Dialog } from '@mui/material';
import { Schemes } from 'Utils/Schemes';
import { useEffect, useState } from 'react';
import { titleCase } from 'Utils/helpers';
import { defaultParams } from 'provider/firebase';
import { AuthorizedTeacher, TeacherShort } from 'types/models/teacher';
import { Classroom, ClassroomNonVirtual, ClassroomVirtual } from 'types/models/classroom';
import { Batch } from 'types/models/batch';
import { Subject, SubjectDoc } from 'types/models/subject';

const resource = MAPPING.CLASSROOMS;

type Props = {
    state: {
        dialog: {
            enable: boolean;
            schemes: GetListResult<SubjectDoc>;
        };
        setDialog: React.Dispatch<
            React.SetStateAction<{
                enable: boolean;
                schemes: GetListResult<SubjectDoc>;
            }>
        >;
    };
};

export default function EditClassroom({ state }: Props) {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();
    const record = useRecordContext() as Classroom;
    const { setDialog, dialog } = state;
    const [loading, setLoading] = useState(true);
    const { getBranches, getCourses, getSchemes, getSemesters, getSubjects, isDerived } =
        new Schemes(dialog.schemes.data);

    const [data, setData] = useState({
        course: record.batch.course,
        scheme: record.batch.schemeId,
        branch: record.branch,
        name: record.name,
        semester: isDerived(record.name)
            ? (record.semester as number)
            : (record.batch.semester as number),
        batch: record.batch.name,
    });
    const [teachersData, setTeachersData] = useState<NonNullable<Classroom['teachers']>>([]);
    const [batches, setBatch] = useState<Classroom['batch'][]>([]);

    const fetchData = () => {
        dataProvider.getList<AuthorizedTeacher>(MAPPING.AUTH_TEACHERS, defaultParams).then((e) => {
            const teachers = [];

            for (let i = 0; i < e.data.length; i++) {
                const teacher = {
                    id: e.data[i].id,
                    emailId: e.data[i].email,
                    name: titleCase(e.data[i].userName),
                };
                teachers.push(teacher);
            }

            setTeachersData(
                e.data.map((e) => ({
                    id: e.id,
                    emailId: e.email,
                    name: titleCase(e.userName),
                }))
            );
        });

        dataProvider.getList<Batch>(MAPPING.BATCHES, defaultParams).then((e) => {
            setBatch(e.data);
        });
    };
    useEffect(() => {
        setLoading(true);
        fetchData();
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = async (e: any) => {
        const record = e as Classroom;

        const common = {
            name: record.name,
            branch: record.branch,
            batch: record.batch,
        };

        type OmittedParams = 'id' | 'students';

        let finalData: Omit<ClassroomNonVirtual | ClassroomVirtual, OmittedParams>;

        if (!isDerived(record.name)) {
            const nonVirtualClassroom = {
                ...common,
                isDerived: false,
                subjects: record.subjects,
            };

            finalData = nonVirtualClassroom;
        } else {
            const recordVirtual = record as ClassroomVirtual; //type casting

            const selectedTeachers = recordVirtual.teachers.map((e) => e.id);
            const newTeachers: Classroom['teachers'] = teachersData.filter((e) =>
                selectedTeachers.includes(e.id)
            );

            const dataSubjects = getSubjects(data.scheme, data.branch, data.semester);
            const subject = dataSubjects.find((e) => e.id === recordVirtual.subject.id) as Subject;

            recordVirtual.subject = {
                id: subject.id,
                code: subject.id.toUpperCase(),
                name: subject.name,
            };

            const virtualClassroom: Omit<ClassroomVirtual, OmittedParams> = {
                ...common,
                isDerived: true,
                parentClasses: recordVirtual.parentClasses,
                subject: recordVirtual.subject,
                subjectId: recordVirtual.subject.id,
                teachers: newTeachers,
                semester: recordVirtual.semester,
            };

            finalData = virtualClassroom;
        }

        await dataProvider.update(resource, {
            id: record.id,
            data: finalData,
            previousData: record,
        });
        refresh();
        notify(`Edited ${record.id}`, { type: 'success' });
        setDialog({ ...dialog, enable: false });
    };

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
        }
        return errors;
    };

    return (
        <>
            {!loading && (
                <Dialog
                    open={dialog.enable}
                    onClose={() => setDialog({ ...dialog, enable: false })}
                    fullWidth={true}
                >
                    <SimpleForm
                        defaultValues={record}
                        toolbar={false}
                        style={{ alignItems: 'stretch' }}
                        resource={resource}
                        onSubmit={handleSave}
                        validate={validateClassroom}
                    >
                        <SelectInput
                            label="Course"
                            source="batch.course"
                            choices={getCourses()}
                            onChange={(e) => setData({ ...data, course: e.target.value })}
                            required
                            disabled={true}
                        />
                        <SelectInput
                            label="Scheme Id"
                            source="batch.schemeId"
                            choices={getSchemes(data.course)}
                            onChange={(e) => setData({ ...data, scheme: e.target.value })}
                            required
                            disabled={true}
                        />
                        <SelectInput
                            label="Batch Name"
                            source="batch.name"
                            choices={batches.map(({ name }) => ({ id: name, name: name }))}
                            onChange={(e) => setData({ ...data, batch: e.target.value })}
                            required
                            disabled={true}
                        />
                        <SelectInput
                            source="branch"
                            choices={getBranches(data.scheme)}
                            onChange={(e) => setData({ ...data, branch: e.target.value })}
                            required
                            disabled={true}
                        />
                        <SelectInput
                            source="name"
                            choices={data.branch ? Schemes.classNames : []}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            disabled={true}
                            required
                        />
                        {isDerived(data.name) && (
                            <>
                                <SelectInput
                                    source="semester"
                                    choices={getSemesters(data.scheme)}
                                    onChange={(e) => setData({ ...data, semester: e.target.value })}
                                    required
                                    disabled={true}
                                />
                                <SelectInput
                                    source="subject.id"
                                    label="Subject"
                                    choices={
                                        data.semester
                                            ? getSubjects(data.scheme, data.branch, data.semester)
                                            : []
                                    }
                                    disabled={true}
                                    required
                                />
                                <ReferenceArrayInput
                                    source="parentClasses"
                                    reference={MAPPING.CLASSROOMS}
                                    filter={{ isDerived: false }}
                                    isRequired
                                >
                                    <AutocompleteArrayInput
                                        optionText="id"
                                        source="id"
                                        filterToQuery={(searchText) => ({ id: searchText })}
                                        isRequired
                                        disabled={true}
                                    />
                                </ReferenceArrayInput>
                                <AutocompleteArrayInput
                                    source="teachers"
                                    parse={(value) =>
                                        value && value.map((v: TeacherShort) => ({ id: v }))
                                    }
                                    format={(value) =>
                                        value && value.map((v: TeacherShort) => v.id)
                                    }
                                    choices={teachersData.map((e) => ({ id: e.id, name: e.name }))}
                                    optionText={(choice) => `${titleCase(choice.name)}`}
                                    filterToQuery={(searchText) => ({ id: searchText })}
                                    emptyText="No Option"
                                    sx={{ minWidth: 300 }}
                                    isRequired
                                />
                            </>
                        )}
                        <Stack direction="row" spacing={2}>
                            <SaveButton label="Save" />
                            <DeleteWithConfirmButton
                                variant="outlined"
                                size="medium"
                                color="inherit"
                                confirmTitle=""
                                confirmContent="You will not be able to recover this classroom. Are you sure?"
                                mutationOptions={{
                                    onSuccess: () => {
                                        notify('Classroom Deleted');
                                        redirect('list', MAPPING.CLASSROOMS);
                                    },
                                }}
                            />
                        </Stack>
                    </SimpleForm>
                </Dialog>
            )}
        </>
    );
}
