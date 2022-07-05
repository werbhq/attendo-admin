import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import {
  BooleanField,
  TextField,
  Show,
  FunctionField,
  ReferenceField,
  Datagrid,
  Tab,
  TabbedShowLayout,
  NumberField,
  EmailField,
  useRecordContext,
  useListContext,
  useNotify,
  useRefresh,
  useDataProvider,
  useUnselectAll,
  SingleFieldList,
  useShowController,
  ArrayField,
  ListContextProvider,
  useList,
  useRecordSelection,
} from "react-admin";
import { useState } from "react";
import EditStudent from "./components/EditStudent";
import { MAPPING } from "../../provider/mapping";
import { sortByRoll } from "../../Utils/helpers";
import EditClassroom from "./components/EditClassroom";
import { Schemes } from "../../Utils/Schemes";

const resource = MAPPING.STUDENTS;

const CustomStudentEditButton = ({ state }) => {
  const { setdialouge, dialouge } = state;
  return (
    <FunctionField
      label="Edit"
      render={(record) => {
        return (
          <Button
            startIcon={<EditIcon />}
            onClick={() => {
              setdialouge({
                ...dialouge,
                enable: true,
                add: false,
                record,
              });
            }}
          />
        );
      }}
    />
  );
};

const CustomStudentBulkDeleteButton = () => {
  const dataProvider = useDataProvider();
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const { selectedIds } = useListContext();

  const unselectAll = useUnselectAll(resource);

  const students = record.students.filter((e) => !selectedIds.includes(e.id));
  const count = selectedIds.length;

  const [showDeleteDialouge, setShowDeleteDialouge] = useState(false);

  const handleClose = () => setShowDeleteDialouge(!showDeleteDialouge);

  const handleDelete = async () => {
    await dataProvider.updateMany(resource, {
      id: record.id,
      data: students.sort(sortByRoll),
    });
    unselectAll();
    refresh();
    notify(`Deleted ${count} Student`, { type: "success" });
  };

  return (
    <div>
      <Button
        variant="text"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={handleClose}
      >
        Delete
      </Button>
      <Dialog open={showDeleteDialouge} keepMounted onClose={handleClose}>
        <DialogTitle>{"Are you sure you want to delete?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {count} Students
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button
            onClick={async () => {
              handleDelete();
              handleClose();
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const CustomVirtualStudentSaveButton = ({ list, callback }) => {
  const dataProvider = useDataProvider();
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();

  const { selectedIds } = useListContext();

  const students = list.filter((e) => selectedIds.includes(e.id));
  const count = selectedIds.length;

  const handleClose = async () => {
    await dataProvider.updateMany(resource, {
      id: record.id,
      data: students.sort(sortByRoll),
    });
    refresh();
    notify(`Added ${count} Student`, { type: "success" });
    await callback(students.sort(sortByRoll));
  };

  return (
    <Button
      variant="text"
      color="primary"
      startIcon={<SaveIcon />}
      onClick={handleClose}
    >
      Save
    </Button>
  );
};

export const ClassroomShow = () => {
  const [studentDialouge, setStudentDialouge] = useState({
    enable: false,
    add: false,
    record: {},
  });

  const [classroomDialouge, setClassroomDialouge] = useState({
    enable: false,
    schemes: [],
  });

  const { record } = useShowController();
  const dataProvider = useDataProvider();

  const [studentVirtualDialouge, setStudentVirtualDialouge] = useState({
    enable: false,
  });

  const virtualClassEditSaveHandler = async (students = record?.students) => {
    if (!studentVirtualDialouge.enable) {
      const classes = await Promise.all(
        record.parentClasses.map((e) =>
          dataProvider.getOne(MAPPING.CLASSROOMS, { id: e })
        )
      );

      const fullStudents = [];
      classes?.forEach((e) => {
        const students = e.data.students.map((_e) => ({
          ..._e,
          classId: e.data.id,
        }));
        fullStudents.push(...students);
      });

      setListData(fullStudents);
      select(record?.students.map((e) => e.id));

      setStudentVirtualDialouge({
        ...studentVirtualDialouge,
        enable: true,
      });
    } else {
      unselectAll();
      setStudentVirtualDialouge({
        ...studentVirtualDialouge,
        enable: false,
      });

      setListData(students);
    }
  };

  const [listData, setListData] = useState(record?.students || []);
  const listContext = useList({ data: listData, resource });
  const [, { select }] = useRecordSelection(resource);
  const unselectAll = useUnselectAll(resource);

  listContext.onUnselectItems = virtualClassEditSaveHandler;

  return (
    <Show emptyWhileLoading>
      <TabbedShowLayout>
        <Tab label="summary">
          <TextField source="id" />
          <ReferenceField
            source="schemeId"
            reference={MAPPING.SUBJECT}
            link="show"
          >
            <TextField source="id" />
          </ReferenceField>
          <ReferenceField
            source="course"
            reference={MAPPING.SEMESTERS}
            link="show"
          >
            <TextField source="id" />
          </ReferenceField>
          <TextField source="year" />
          <TextField source="semester" emptyText="-" />
          <FunctionField
            label="Branch"
            render={(record) => record.branch.toUpperCase()}
          ></FunctionField>
          <FunctionField
            label="Name"
            render={(record) =>
              Schemes.classNames.find(({ id }) => record.name === id).name
            }
          ></FunctionField>
          <BooleanField source="isDerived" label="Virtual Class" />

          {record?.isDerived && (
            <FunctionField
              label="Subject Id"
              render={(record) => record.subjectId.toUpperCase()}
            ></FunctionField>
          )}
          {record?.isDerived && <NumberField source="semester" />}
          {record?.isDerived && (
            <ArrayField source="parentClasses">
              <SingleFieldList
                style={{
                  flexDirection: "column",
                  padding: "10px 0px",
                }}
                data={record.parentClasses.map((e) => ({ id: e }))}
                linkType={false}
              >
                <FunctionField
                  render={(record) => (
                    <ReferenceField
                      source="id"
                      reference={MAPPING.CLASSROOMS}
                      link="show"
                    >
                      <TextField source="id" />
                    </ReferenceField>
                  )}
                />
              </SingleFieldList>
            </ArrayField>
          )}

          <FunctionField
            label="Students Count"
            render={(record) => record.students.length}
          ></FunctionField>

          <div style={{ margin: "20px 0px" }}>
            <Stack direction="row" spacing={2}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={async () => {
                  const schemes = await dataProvider.getList(MAPPING.SUBJECT);
                  setClassroomDialouge({
                    ...classroomDialouge,
                    enable: true,
                    schemes: schemes,
                  });
                }}
              >
                Edit
              </Button>
            </Stack>
          </div>
        </Tab>

        <Tab label="students" path="students">
          <div style={{ margin: "20px 0px" }}>
            {!record?.isDerived ? (
              <Button
                size="medium"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setStudentDialouge({
                    ...studentDialouge,
                    add: true,
                    enable: true,
                    record: {},
                  });
                }}
              >
                Add Student
              </Button>
            ) : (
              !studentVirtualDialouge.enable && (
                <Button
                  size="medium"
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={virtualClassEditSaveHandler}
                >
                  Edit Students
                </Button>
              )
            )}
          </div>
          <ListContextProvider value={listContext}>
            <Datagrid
              bulkActionButtons={
                record?.isDerived ? (
                  studentVirtualDialouge.enable && (
                    <CustomVirtualStudentSaveButton
                      list={listData}
                      callback={virtualClassEditSaveHandler}
                    />
                  )
                ) : (
                  <CustomStudentBulkDeleteButton />
                )
              }
            >
              <NumberField source="rollNo" />
              {record?.isDerived && (
                <ReferenceField
                  source="classId"
                  reference={MAPPING.CLASSROOMS}
                  link="show"
                >
                  <TextField source="id" />
                </ReferenceField>
              )}
              <TextField source="regNo" />
              <TextField source="name" />
              <EmailField source="email" />
              <TextField source="userName" />
              {!record?.isDerived && (
                <CustomStudentEditButton
                  state={{
                    dialouge: studentDialouge,
                    setdialouge: setStudentDialouge,
                  }}
                />
              )}
            </Datagrid>
          </ListContextProvider>
        </Tab>
        {studentDialouge.enable && (
          <EditStudent
            state={{
              dialouge: studentDialouge,
              setdialouge: setStudentDialouge,
            }}
          />
        )}
        {classroomDialouge.enable && (
          <EditClassroom
            state={{
              dialouge: classroomDialouge,
              setdialouge: setClassroomDialouge,
            }}
          />
        )}
      </TabbedShowLayout>
    </Show>
  );
};

export default ClassroomShow;
