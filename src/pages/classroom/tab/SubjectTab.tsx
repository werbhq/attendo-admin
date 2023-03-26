import { useEffect, useState } from 'react';
import {
    TextField,
    Datagrid,
    ListContextProvider,
    SimpleForm,
    SaveButton,
    useDataProvider,
    useList,
    useRefresh,
    useNotify,
    WrapperField,
    AutocompleteArrayInput,
    SelectInput,
    Tab,
    useRecordContext,
    ReferenceField,
} from 'react-admin';
import TeacherField from '../components/classroom/CustomTeacherField';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Dialog } from '@mui/material';
import { MAPPING } from 'provider/mapping';
import { CustomSubjectBulkDeleteButton } from '../components/subject/Button';
import Button from '@mui/material/Button';
import { Classroom, ClassroomSubject } from 'types/models/classroom';
import { Subject, SubjectBranchSubs, SubjectDoc, SubjectSemester } from 'types/models/subject';
import { titleCase } from 'Utils/helpers';
import { AuthorizedTeacher, TeacherShort } from 'types/models/teacher';
import { defaultParams } from 'provider/firebase';
import EditIcon from '@mui/icons-material/Edit';
import { ClassroomFrontend } from 'types/frontend/classroom';

type EditProps = {
    setSubjectDialogue: React.Dispatch<
        React.SetStateAction<{
            open: boolean;
            record: {};
        }>
    >;
};

const EditButton = ({ setSubjectDialogue }: EditProps) => {
    const record: ClassroomFrontend = useRecordContext();
    return (
        <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => {
                setSubjectDialogue((e) => ({
                    ...e,
                    open: true,
                    record: record,
                }));
            }}
        >
            Edit
        </Button>
    );
};

const SubjectTab = ({ label, path, ...props }: { label: string; path: string; props?: any }) => {
    const record: Classroom = useRecordContext();
    const refresh = useRefresh();
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const [loading, setLoading] = useState(false);

    const [semester, setSemester] = useState<number>(record.batch.semester);
    const [semesterChoices, setSemesterChoices] = useState<SubjectSemester[]>([]);
    const [branchData, setBranchData] = useState<SubjectBranchSubs | undefined>(undefined);
    const [teachersData, setTeachersData] = useState<TeacherShort[]>(record?.teachers ?? []);

    const [dialog, setDialog] = useState({
        open: false,
        record: {},
    });

    const sem_record =
        record.subjects === undefined
            ? ([] as ClassroomSubject[])
            : (Object.values(record.subjects).filter(
                  (val) => val.semester === semester
              ) as ClassroomSubject[]);

    const [subjectDialogue, setSubjectDialogue] = useState({
        open: false,
        record: {},
    });

    const tableData = useList({ data: sem_record });

    const handleClose = () => setDialog({ ...dialog, open: false });
    const handleEditClose = () => setSubjectDialogue({ ...subjectDialogue, open: false });

    const handleEdit = async (e: any) => {
        const oldData = record;
        const subjects = record.subjects === undefined ? [] : Object.values(record.subjects);
        const currentSubjIndex = subjects.findIndex((f) => f.id === e.id);
        const teachers = e.teachers.map((o: { id: string }) => {
            const teacher = teachersData.find((_e) => _e.id === o.id);
            return {
                id: teacher?.id,
                emailId: teacher?.emailId,
                name: teacher?.name,
            };
        }) as TeacherShort[];
        let tchrsList: TeacherShort[] = [];
        const presentTeachers = new Set(teachers.map((e) => e.id));
        teachers.forEach((e) => {
            if (presentTeachers.has(e.id)) {
                tchrsList.push(e);
            } else {
                tchrsList = [];
            }
        });
        subjects[currentSubjIndex].teachers = tchrsList;
        const subjectsMap = {} as { [id: string]: ClassroomSubject };

        subjects.forEach((obj) => {
            subjectsMap[obj.id] = obj;
        });
        record.subjects = subjectsMap;
        await dataProvider.update(MAPPING.CLASSROOMS, {
            id: record.id,
            data: record,
            previousData: oldData,
        });
        refresh();
        notify('Classroom Subject Updated');
        handleEditClose();
    };

    const handleSubmit = async (e: any) => {
        const oldData = record;
        const { SubjectId, TeacherIds } = e as {
            SubjectId: string;
            TeacherIds: { id: string }[];
        };

        const subject = branchData?.subjects.find((e) => e.id === SubjectId) as Subject;
        const teachers = TeacherIds.map((o) => {
            const teacher = teachersData.find((_e) => _e.id === o.id);
            return {
                id: teacher?.id,
                emailId: teacher?.emailId,
                name: teacher?.name,
            };
        }) as TeacherShort[];
        const subjects = record.subjects === undefined ? [] : Object.values(record.subjects);
        const subjectIndex = subjects.findIndex((e) => e.subject.id === SubjectId);
        if (subjectIndex === -1) {
            subjects.push({
                id: `${subject.id}-${record.id}-${semester}`,
                subject,
                teachers,
                semester,
            });
        } else {
            const alreadyPresent: string[] = []; // Names
            const final: TeacherShort[] = subjects[subjectIndex].teachers;
            teachers.forEach((e) => {
                if (
                    final.some((f) => {
                        return f.id === e.id;
                    })
                )
                    alreadyPresent.push(e.name);
                else {
                    final.push(e);
                }
            });
            if (alreadyPresent.length !== 0) {
                notify(`${alreadyPresent.join(',')} were already present`, { type: 'info' });
                handleClose();
            }
            subjects[subjectIndex].teachers = final;
        }
        const subjectsMap = {} as { [id: string]: ClassroomSubject };

        subjects.forEach((obj) => {
            subjectsMap[obj.id] = obj;
        });
        record.subjects = subjectsMap;

        await dataProvider.update<Classroom>(MAPPING.CLASSROOMS, {
            id: record.id,
            data: record,
            previousData: oldData,
        });

        refresh();
        notify(`Classroom Subject ${SubjectId} Updated`, { type: 'success' });
        handleClose();
    };

    const shouldDisableSubject = () => {
        let a = false;
        if (semesterChoices.length === 0) {
            a = true;
        } else if (branchData !== undefined) {
            branchData.subjects !== undefined
                ? branchData.subjects.length !== 0
                    ? (a = false)
                    : (a = true)
                : (a = false);
        } else if (branchData === undefined) {
            a = true;
        }

        return a;
    };

    const fetchData = () => {
        dataProvider.getList<AuthorizedTeacher>(MAPPING.AUTH_TEACHERS, defaultParams).then((e) => {
            const teacherData = e.data
                .filter((e) => e.created)
                .map(({ id, email, userName }) => ({
                    id,
                    emailId: email,
                    name: userName === undefined ? '' : titleCase(userName),
                }));
            setTeachersData(teacherData);
        });

        dataProvider
            .getOne<SubjectDoc>(MAPPING.SUBJECT, { id: record.batch.schemeId })
            .then((e) => {
                //current sem from the classroom
                const sem = record.batch.semester;
                //semester data from the subjects
                const semIndex = e.data.semesters.findIndex((g) => g.semester === sem);

                if (semIndex !== -1) {
                    //current branch from classroom
                    const branch = record.branch;
                    if (e.data.semesters[semIndex] !== undefined) {
                        //branch data from subject
                        const branchIndex = e.data.semesters[semIndex].branchSubs.findIndex(
                            (f) => f.branch === branch
                        );
                        const totalSemesters = e.data.semesters.length;
                        const semesters = [];
                        for (let i = 0; i < totalSemesters; i++)
                            semesters.push(e.data.semesters[i]);

                        setSemesterChoices(semesters); //list of semester data of each classroom
                        setSemester(e.data.semesters[semIndex].semester); //current semester
                        setBranchData(e.data.semesters[semIndex].branchSubs[branchIndex]); //branch data
                    }
                }
            });
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Tab label={label} path={path} {...props}>
            {loading ? (
                <>Loading...</>
            ) : (
                <Stack spacing={5}>
                    <Stack direction="row" spacing={2}>
                        <Select
                            value={semester}
                            label="Semester"
                            onChange={(value) => {
                                const semDetails = semesterChoices?.find(
                                    (e) => e.semester === value.target.value
                                );
                                if (semDetails !== undefined) {
                                    const branchIndex = semDetails.branchSubs.findIndex(
                                        (f) => f.branch === record.branch
                                    );
                                    setSemester(semDetails.semester);
                                    setBranchData(semDetails.branchSubs[branchIndex]);
                                }
                            }}
                            sx={{ width: '60px' }}
                        >
                            {semesterChoices.length !== 0 ? (
                                semesterChoices.map((e, index) => (
                                    <MenuItem value={e.semester} key={index}>
                                        {e.semester}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value={undefined} key={0}>
                                    No Data
                                </MenuItem>
                            )}
                        </Select>
                    </Stack>
                    <Stack direction="row">
                        <Button
                            disabled={shouldDisableSubject()}
                            variant="contained"
                            size="medium"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setDialog({ open: true, record: {} });
                            }}
                        >
                            ADD SUBJECT
                        </Button>
                    </Stack>

                    <ListContextProvider value={tableData}>
                        <Datagrid bulkActionButtons={<CustomSubjectBulkDeleteButton />}>
                            <WrapperField label="Subject">
                                <TextField source="subject.code" label="Code" /> -{' '}
                                <TextField source="subject.name" label="Name" />
                            </WrapperField>
                            <WrapperField label="Teacher">
                                <TeacherField />
                            </WrapperField>
                            <ReferenceField
                                source="id"
                                reference={MAPPING.ATTENDANCES}
                                link={(record) => `/attendance/${record.id}/show`}
                            />
                            <EditButton setSubjectDialogue={setSubjectDialogue} />
                        </Datagrid>
                    </ListContextProvider>
                    <Dialog open={subjectDialogue.open} onClose={handleEditClose} fullWidth={true}>
                        <SimpleForm
                            record={subjectDialogue.record}
                            defaultValues={subjectDialogue.record}
                            onSubmit={handleEdit}
                            toolbar={false}
                        >
                            <SelectInput
                                source="subject.id"
                                choices={branchData?.subjects}
                                optionText={(choice) => `${choice.code} - ${choice.name}`}
                                // filterToQuery={(searchText: any) => ({ id: searchText })}
                                emptyText="No Option"
                                disabled
                                isRequired
                            />
                            <AutocompleteArrayInput
                                source="teachers"
                                parse={(value) => value && value.map((v: any) => ({ id: v }))}
                                format={(value) => value && value.map((v: { id: any }) => v.id)}
                                choices={teachersData}
                                optionText={(choice) => `${titleCase(choice.name)}`}
                                filterToQuery={(searchText) => ({ id: searchText })}
                                emptyText="No Option"
                                sx={{ minWidth: 300 }}
                                isRequired
                            />
                            <Stack direction="row" spacing={3}>
                                <SaveButton label="Save" />
                            </Stack>
                        </SimpleForm>
                    </Dialog>
                    <Dialog open={dialog.open} onClose={handleClose} fullWidth={true}>
                        <SimpleForm record={dialog.record} onSubmit={handleSubmit} toolbar={false}>
                            <SelectInput
                                source="SubjectId"
                                parse={(value) => value}
                                choices={branchData?.subjects ?? []}
                                optionText={(choice) => `${choice.code} - ${choice.name}`}
                                emptyText="No Option"
                                isRequired
                            />
                            <AutocompleteArrayInput
                                source="TeacherIds"
                                parse={(value: string[]) => value && value.map((v) => ({ id: v }))}
                                format={(value: AuthorizedTeacher[]) =>
                                    value && value.map((v) => v.id)
                                }
                                choices={teachersData}
                                optionText={(choice) => `${titleCase(choice.name)}`}
                                filterToQuery={(searchText) => ({ id: searchText })}
                                emptyText="No Option"
                                sx={{ minWidth: 300 }}
                                isRequired
                            />
                            <Stack direction="row" spacing={3}>
                                <SaveButton label="Add" />
                            </Stack>
                        </SimpleForm>
                    </Dialog>
                </Stack>
            )}
        </Tab>
    );
};

export default SubjectTab;
