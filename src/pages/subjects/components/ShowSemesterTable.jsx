import {
  TextField,
  Datagrid,
  ListContextProvider,
  TextInput,
  SimpleForm,
  ArrayInput,
  SimpleFormIterator,
  FunctionField,
  useRecordContext,
  useList,
  useRefresh,
  useNotify,
  useRedirect,
  required,
} from "react-admin";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Dialog } from "@mui/material";
import { CustomAdd, CustomDelete } from "./CustomButtons";
import { dataProvider } from "../../../provider/firebase";
import { MAPPING } from "../../../provider/mapping";
import CustomSemesterField from "./CustomSemesterField";
import { noSpaceValidation } from "../../../Utils/validations";

const url = MAPPING.SUBJECT;

const SemesterTable = () => {
  const data = useRecordContext();
  const [semData, setSemData] = useState(data.semesters[0]);
  const tableData = useList({
    data: data.semesters,
  });
  const refresh = useRefresh();
  const notify = useNotify();
  const redirect = useRedirect();
  const [showDialouge, setShowDialouge] = useState(false);

  const editButtonHandle = (record) => {
    setSemData(record);
    setShowDialouge(true);
  };
  const handleClose = () => setShowDialouge(false);

  const updateBranch = async (newData) => {
    newData.branchSubs = newData.branchSubs.map(({ branch, subjects }) => ({
      branch: branch.toLowerCase(),
      subjects: subjects || [],
    }));

    const updatedData = data;
    const updateIndex = updatedData.semesters.findIndex(
      ({ semester }) => semester === semData.semester
    );
    updatedData.semesters[updateIndex] = newData;

    await dataProvider.update(url, {
      id: data.id,
      data: updatedData,
      oldData: data,
    });

    handleClose();
    notify(`Semester ${newData.semester} Modified Succesfully`);
    refresh();
  };

  return (
    <div>
      {tableData.data.length === 0 && (
        <Button
          variant="contained"
          onClick={() => {
            redirect("edit", url, data.id);
          }}
        >
          Add Semester
        </Button>
      )}
      <ListContextProvider value={tableData} emptyWhileLoading>
        <Datagrid bulkActionButtons={false}>
          <TextField source="semester" />
          <FunctionField
            label="Branches"
            render={(record) => (
              <CustomSemesterField
                {...record}
                array="branchSubs"
                chip="branch"
              />
            )}
          />
          <FunctionField
            render={(record) => (
              <Button
                label="Edit"
                startIcon={<EditIcon />}
                onClick={() => editButtonHandle(record)}
              >
                Edit
              </Button>
            )}
          />
        </Datagrid>
      </ListContextProvider>
      <Dialog open={showDialouge} onClose={handleClose}>
        <SimpleForm onSubmit={updateBranch} record={semData}>
          <ArrayInput source="branchSubs" label="Branches" fullWidth={false}>
            <SimpleFormIterator
              addButton={CustomAdd({ name: "ADD BRANCH" })}
              removeButton={CustomDelete()}
              getItemLabel={() => ""} // To remove index numbers
              disableReordering
            >
              <TextInput
                source="branch"
                label="branch"
                format={(e) => e.toLowerCase()}
                validate={[required(), noSpaceValidation]}
              />
            </SimpleFormIterator>
          </ArrayInput>
        </SimpleForm>
      </Dialog>
    </div>
  );
};

export default SemesterTable;
