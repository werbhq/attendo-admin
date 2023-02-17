import { MAPPING } from "../../provider/mapping";

import {
  Datagrid,
  TextField,
  List,
  SearchInput,
  TextInput,
  EmailField,
  BooleanField,
  BooleanInput,
  useTranslate,
  BulkDeleteButton,
  BulkUpdateButton,
  
  SelectInput,
  required
} from "react-admin";

import { Chip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import CustomProviders from "../../provider/customProviders";
import { dataProvider } from "../../provider/firebase";


const QuickFilter = ({ label }) => {
    const translate = useTranslate();
    return <Chip sx={{ marginBottom: 1 }} label={translate(label)} />;
};


const filters = [
  <SearchInput source="id" alwaysOn resettable />,
  <TextInput source="branch" resettable />,
  <QuickFilter source="created" label="Create" defaultValue={true}/>,
];



const AuthorizedTeacherList = () => {
  const PostBulkActionButtons = (data) => { 
    // console.log(data);
    return (
    <>
        <BulkUpdateButton label="Update Status" onClick={()=>{handleBulkUpdate(data);}}/>
        <BulkDeleteButton/> 
    </>
);};

  const handleBulkUpdate = async (data) => {
    // console.log("here");
    // console.log(data);

    let dataSet = [];
    for(let id of data.selectedIds)
    {
      // console.log("count"+id);
      let newData = {};

      await dataProvider.getOne(data.resource,{id:id})
      .then((e)=>{
        console.log(e);
        newData = e.data;
        newData.created = false;
      });

      // console.log(newData);

      dataSet.push(newData);    

    }

    const newObj = {
        ids: data.selectedIds,
        data: dataSet,
    };
    console.log(newObj);
    await dataProvider.updateMany(data.resource,newObj );
    // data is an object containing the new values for the fields
    // In this example, we are updating the status field to "approved"
    // data.created = false;
    // return dataProvider.createEmails('myResource', data); // Replace 'myResource' with your resource name
  };

  return (<List exporter={false} filters={filters} >
    <Datagrid rowClick="show" bulkActionButtons={<PostBulkActionButtons/>}>
      <EmailField source="email" />
      <TextField source="userName" />
      <BooleanField source="created" looseValue/>
      <TextField source="branch" />
    </Datagrid>
  </List>
);
  };

export default AuthorizedTeacherList;
