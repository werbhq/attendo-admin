import {
  TextInput,
  Edit,
  SimpleForm,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
} from "react-admin";

export const CourseEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="id" />
        <NumberInput source="totalSemesters" />
        <ArrayInput source="batches">
          <SimpleFormIterator>
            <NumberInput source="sem" />
            <TextInput source="id" />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );
};
