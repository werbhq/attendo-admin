// in src/posts.js
import { Stack } from "@mui/material";
import * as React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  SimpleFormIterator,
  ArrayInput,
  useRefresh,
  useNotify,
  SaveButton,
  useRedirect,
} from "react-admin";
import { dataProvider } from "../../provider/firebase";
import { MAPPING } from "../../provider/mapping";
import { CustomAdd, CustomDelete } from "./components/customButton";
import CDeleteButton from "./components/CustomDeleteButton";

export const SubjectEdit = () => {
  const url = MAPPING.SUBJECT;
  const refresh = useRefresh();
  const notify = useNotify();
  const redirect = useRedirect();

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
    redirect("show", MAPPING.SUBJECT, data.id);
  };

  return (
    <Edit>
      <SimpleForm onSubmit={handleSubmit} toolbar={false}>
        <TextInput disabled label="Id" source="id" />
        <TextInput source="organization" required />
        <TextInput source="course" required />
        <TextInput source="year" required />
        <ArrayInput source="semesters" fullWidth="true" label="Semesters">
          <SimpleFormIterator
            disableReordering
            addButton={CustomAdd({ name: "Add Semester" })}
            removeButton={CustomDelete()}
            getItemLabel={() => ""}
          >
            <TextInput source="semester" label="Semester Number" />
          </SimpleFormIterator>
        </ArrayInput>
        <Stack spacing={3} direction={"row"} sx={{ mt: "20px" }}>
          <SaveButton />
          <CDeleteButton />
        </Stack>
      </SimpleForm>
    </Edit>
  );
};
