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
} from "react-admin";
import { useState } from "react";
import EditStudent from "./components/EditStudent";
import { MAPPING } from "../../provider/mapping";
import { sortByRoll } from "../../Utils/helpers";
import CustomArrayList from "../../components/ui/CustomArrayList";
import EditClassroom from "./components/EditClassroom";
import { dataProvider } from "../../provider/firebase";
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
          <CustomArrayList fieldName={"students"} resource={resource}>
            <div style={{ margin: "20px 0px" }}>
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
            </div>
            <Datagrid
              bulkActionButtons={<CustomStudentBulkDeleteButton />}
              resource={resource}
            >
              <NumberField source="rollNo" />
              <TextField source="regNo" />
              <TextField source="name" />
              <EmailField source="email" />
              <TextField source="userName" />
              <CustomStudentEditButton
                state={{
                  dialouge: studentDialouge,
                  setdialouge: setStudentDialouge,
                }}
              />
            </Datagrid>
          </CustomArrayList>
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
