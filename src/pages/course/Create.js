import { useState } from "react";
import {
  required,
  number,
  Create,
  SimpleForm,
  NumberInput,
  TextInput,
} from "react-admin";
import { autoCapitalize } from "../../Utils/helpers";

const CourseCreate = ({ schemes: schemeData }) => {
  const onSubmit = async (data) => {
    data = { ...data, id: data.id.toUpperCase(), batches: [] };

    for (let i = 0; i <= data.totalSemesters; i += 2) {
      data.batches.push({
        id: null,
        sem: i,
      });
    }

    console.log(data);

    // const id = `${data.course}-${data.organization}-${data.year}`;
    // data = { id, ...data, semesters: [] };
    // await dataProvider.create(url, { data, id: data.id });
    // notify(`Added ${id}`, {
    //   type: "success",
    // });
    // refresh();
    // redirect("list", url);
  };

  const evenOnlyValidation = (value) => {
    if (value % 2 !== 0) return "Even Numbers Only!";
    else return undefined;
  };

  return (
    <Create>
      <SimpleForm onSubmit={onSubmit}>
        <TextInput
          source="id"
          validate={[required()]}
          format={autoCapitalize}
        />
        <NumberInput
          source="totalSemesters"
          validate={[required(), number("Not a number"), evenOnlyValidation]}
        />
      </SimpleForm>
    </Create>
  );
};

export default CourseCreate;
