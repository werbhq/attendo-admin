import SK from 'pages/source-keys';
import { Datagrid, List, TextField, NumberField } from 'react-admin';

const CoursesList = () => {
    return (
        <List exporter={false}>
            <Datagrid rowClick="show">
                <TextField source={SK.COURSE("id")} />
                <NumberField source={SK.COURSE("totalSemesters")} />
            </Datagrid>
        </List>
    );
};
export default CoursesList;
