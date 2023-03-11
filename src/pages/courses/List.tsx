import { Datagrid, List, TextField, NumberField } from 'react-admin';

const CoursesList = () => {
    return (
        <List exporter={false}>
            <Datagrid rowClick="show">
                <TextField source="id" />
                <NumberField source="totalSemesters" />
            </Datagrid>
        </List>
    );
};
export default CoursesList;
