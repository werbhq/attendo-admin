import { Stack } from "@mui/material";
import * as React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  SimpleFormIterator,
  ArrayInput,
  SaveButton,
  useRefresh,
  useNotify,
  useRedirect,
  SelectInput,
  useDataProvider,
  required,
  NumberInput,
} from "react-admin";
import { MAPPING } from "../../provider/mapping";
import {
  CustomAdd,
  CustomDelete,
  DeleteButtonDialouge,
} from "./components/CustomButtons";
import { useParams } from "react-router-dom";

const url = MAPPING.SUBJECT;

const SubjectEdit = () => {
  const { id } = useParams();
  const refresh = useRefresh();
  const notify = useNotify();
  const redirect = useRedirect();

  const dataProvider = useDataProvider();
  const possibleValues = ["BTECH", "MTECH"];
  const choices = possibleValues.map((value) => ({
    id: value,
    name: value,
  }));

  const deleteAll = async () => {
    await dataProvider.delete(url, {
      id: id,
    });

    notify(`Deleted ${id}`, {
      type: "error",
    });
    refresh();
    redirect("list", url);
  };

  const handleSubmit = async (data) => {
    data.semesters = data.semesters.map(({ semester, branchSubs }) => ({
      semester,
      branchSubs: branchSubs || [],
    }));

    await dataProvider.update(url, {
      id: data.id,
      data: data,
      oldData: {},
    });

    notify(`Edited ${data.id}`, {
      type: "success",
    });
    refresh();
    redirect("show", url, data.id);
  };

  return (
    <Edit>
      <SimpleForm onSubmit={handleSubmit} toolbar={false}>
        <TextInput disabled label="Id" source="id" />
        <TextInput source="organization" required />
        <SelectInput
          source="course"
          choices={choices}
          validate={[required()]}
          label="course"
        />
        <TextInput source="year" required />
        <ArrayInput source="semesters" fullWidth={false} label="Semesters">
          <SimpleFormIterator
            disableReordering
            addButton={CustomAdd({ name: "Add Semester" })}
            removeButton={CustomDelete()}
            getItemLabel={() => ""} // To remove index numbers
          >
            <NumberInput
              source="semester"
              onWheel={(e) => e.preventDefault()}
              label="Semester Number"
            />
          </SimpleFormIterator>
        </ArrayInput>
        <Stack spacing={3} direction={"row"} sx={{ mt: "20px" }}>
          <SaveButton />
          <DeleteButtonDialouge handleDelete={deleteAll} />
        </Stack>
      </SimpleForm>
    </Edit>
  );
};

export default SubjectEdit;
