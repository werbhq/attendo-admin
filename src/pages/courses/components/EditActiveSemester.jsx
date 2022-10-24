import * as React from "react";
import {
  SimpleForm,
  useDataProvider,
  useRecordContext,
  useRefresh,
  useNotify,
  SaveButton,
  required,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
  number,
  useRedirect,
  TextInput,
} from "react-admin";
import { MAPPING } from "../../../provider/mapping";
import { Stack } from "@mui/material";

const resource = MAPPING.SEMESTERS;

export default function EditActiveSemester() {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();

  const record = useRecordContext();

  const handleSave = async (data) => {
    const years = new Set();

    for (let batch of data.batches) {
      if (years.has(batch.id)) {
        notify(`S${batch.sem} has duplicate year`, {
          type: "error",
        });
        return;
      } else {
        years.add(batch.id);
      }
    }

    data.batches = data.batches.sort((a, b) => a.sem - b.sem);
    await dataProvider.update(resource, {
      id: data.id,
      data: data,
    });

    refresh();
    notify(`Edited ${data.id}`, {
      type: "success",
    });
    redirect("show", resource, data.id);
  };

  const getYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (
      let i = currentYear - record.totalSemesters / 2;
      i <= currentYear;
      i++
    ) {
      years.push({ id: i, name: i });
    }
    return years;
  };

  return (
    <SimpleForm
      defaultValues={record}
      toolbar={false}
      style={{ alignItems: "stretch" }}
      resource={resource}
      onSubmit={handleSave}
    >
      <ArrayInput source="batches">
        <SimpleFormIterator
          getItemLabel={(index) => ""}
          disableRemove
          disableAdd
          disableReordering
        >
          <TextInput
            source="sem"
            label="Semester"
            validate={(required(), number())}
            disabled
          />
          <SelectInput
            choices={getYears()}
            source="id"
            label="Year"
            validate={required()}
          />
        </SimpleFormIterator>
      </ArrayInput>
      <Stack direction="row" spacing={2}>
        <SaveButton label="Save" />
      </Stack>
    </SimpleForm>
  );
}
