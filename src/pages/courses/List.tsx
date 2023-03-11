import { datagridStyle, listStyle } from 'components/ui/CustomTableStyling';
import { Datagrid, List, TextField, NumberField } from 'react-admin';

const CoursesList = () => {
    return (
        <List exporter={false} sx={listStyle}>
            <Datagrid rowClick="show" sx={datagridStyle}>
                <TextField source="id" />
                <NumberField source="totalSemesters" />
            </Datagrid>
        </List>
    );
};
export default CoursesList;
