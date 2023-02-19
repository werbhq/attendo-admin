import { MAPPING } from "../../provider/mapping";
import { cloudFunctions } from "../../provider/firebase";


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

import { httpsCallable } from "firebase/functions";



import { Chip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import CustomProviders from "../../provider/customProviders";
import { dataProvider } from "../../provider/firebase";


const QuickFilter = ({ label, source, value }) => {
  // console.log("ETF")
  //   console.log(label,source,value);
    const translate = useTranslate();
    return <Chip sx={{ marginBottom: 1 }} label={translate(label)} />;
};


const filters = [
  <SearchInput source="id" alwaysOn resettable />,
  <TextInput source="branch" resettable />,
  //<SelectInput source="created" label="new create" choices={[{id: true, name: "True"}, {id:false, name: "False"}]}/>,
  <QuickFilter source="created" label="Create"/>,
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
      
    const createAccountApi = httpsCallable(
      cloudFunctions,
      "createAccounts"
    );
    
    const response = await (
      await createAccountApi(["navaneethvenu.19cs084@mbcet.ac.in"])
    ).data;

    console.log(response);

  };

  return (<List exporter={false} filters={filters} >
    <Datagrid rowClick="show" bulkActionButtons={<PostBulkActionButtons/>}>
      <EmailField source="email" />
      <TextField source="userName" />
      <BooleanField source="created" looseValue sortable={false}/>
      <TextField source="branch" />
    </Datagrid>
  </List>
);
  };

export default AuthorizedTeacherList;
