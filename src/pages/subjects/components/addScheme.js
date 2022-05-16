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
  DeleteButton,
  SaveButton
} from "react-admin";
import { dataProvider } from "../../../provider/firebase";
import { MAPPING } from "../../../provider/mapping";
import { customAdd,
         customDelete
} from "./customButton"; 
import CDeleteButton from "./CustomDeleteButton";


export const PostEdit = (info) => {
  const url = MAPPING.SUBJECT;
  const refresh = useRefresh();
  const notify = useNotify();

  const handleSubmit = (newData) => {
  
   

    dataProvider
      .update(url, { id: newData.id, data: newData, oldData: {} })
      .then((response) => {
        console.log(response); // { id: 123, title: "hello, world" }
      });
    refresh();
    notify("Classroom Inputed");
  };
  
  
  
  return(

  <Edit>
         <SimpleForm onSubmit={handleSubmit} toolbar={false}>
            <TextInput disabled label="Id" source="id" />
            <TextInput source="organization" />
            <TextInput source="course" />
            <TextInput source="year" />
            <ArrayInput source="semesters" fullWidth="true">
                <SimpleFormIterator disableReordering addButton={customAdd()} removeButton={customDelete()}>
                    <TextInput source="semester" label="semester"/>
                </SimpleFormIterator>
            </ArrayInput>
            <Stack spacing={3} direction={"row"} sx={{mt:'20px'}}>
            <SaveButton/>
            <CDeleteButton/>
            </Stack>
  

         </SimpleForm>
  </Edit>
)};

