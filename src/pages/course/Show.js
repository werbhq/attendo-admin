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
  import { MAPPING } from "../../provider/mapping";
  import CustomArrayList from "../../components/ui/CustomArrayList";
  import { dataProvider } from "../../provider/firebase";
  import { Schemes } from "../../Utils/Schemes";
  
  const resource = MAPPING.SEMESTERS;
  const CustomCourseEditButton = ({ state }) => {
    const { courseDialouge,  setCourseDialog} = state;
    return (
      <FunctionField
        label="Edit"
        render={(record) => {
          return (
            <Button
              startIcon={<EditIcon />}
              onClick={() => {
                setCourseDialog({
                  ...courseDialouge,
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
  
  
  export const CourseShow = () => {
    const [studentDialouge, setStudentDialouge] = useState({
      enable: false,
      add: false,
      record: {},
    });
  
    const [courseDialouge, setCourseDialouge] = useState({
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
              source="year"
              reference={MAPPING.SEMESTERS}
              link="show"
            >
            </ReferenceField>
            <TextField source="course" />
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
  
            <div style={{ margin: "20px 0px" }}>
              <Stack direction="row" spacing={2}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={async () => {
                    const schemes = await dataProvider.getList(MAPPING.SEMESTERS);
                    setCourseDialouge({
                      ...courseDialouge,
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
  
        </TabbedShowLayout>
      </Show>
    );
  };
  
  
  export default CourseShow;
  
  