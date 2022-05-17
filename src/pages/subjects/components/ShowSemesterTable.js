import {
  TextField,
  Datagrid,
  useRecordContext,
  ListContextProvider,
  useList,
  ArrayField,
  SingleFieldList,
  ChipField,
  TextInput,
  SimpleForm,
  ArrayInput,
  SimpleFormIterator,
  FunctionField,
  useRefresh,
  useNotify,
} from "react-admin";

import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

import { Button, Dialog } from "@mui/material";
import { CustomAdd, CustomDelete } from "./customButton";
import { dataProvider } from "../../../provider/firebase";
import { MAPPING } from "../../../provider/mapping";

const SemesterTable = () => {
  const data = useRecordContext();
  const url = MAPPING.SUBJECT;
  const [semData, setSemData] = useState(data.semesters[0]);
  const tableData = useList({
    data: data.semesters,
  });
  const refresh = useRefresh();
  const notify = useNotify();
  const [open, setOpen] = useState(false);

  const handleClickOpen = (record) => {
    setSemData(record);
    setOpen(true);
  };

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

    refresh();
    notify("Classroom Inputed");
    handleClose();
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <ListContextProvider value={tableData} emptyWhileLoading>
        <Datagrid bulkActionButtons={false}>
          <TextField source="semester" />
          <ArrayField source="branchSubs" label="Branches">
            <SingleFieldList linkType={false}>
              <ChipField source="branch" />
            </SingleFieldList>
          </ArrayField>
          <FunctionField
            render={(record) => (
              <Button
                label="Edit"
                startIcon={<EditIcon />}
                onClick={() => handleClickOpen(record)}
              >
                Edit
              </Button>
            )}
          />
        </Datagrid>
      </ListContextProvider>
      <Dialog open={open} onClose={handleClose}>
        <SimpleForm onSubmit={updateBranch} record={semData}>
          <ArrayInput source="branchSubs" label="Branches" fullWidth="flase">
            <SimpleFormIterator
              addButton={CustomAdd({ name: "Add Branch" })}
              removeButton={CustomDelete()}
              disableReordering
            >
              <TextInput
                source="branch"
                label="branch"
                format={(e) => e.toLowerCase()}
              />
            </SimpleFormIterator>
          </ArrayInput>
        </SimpleForm>
      </Dialog>
    </>
  );
};

export default SemesterTable;
