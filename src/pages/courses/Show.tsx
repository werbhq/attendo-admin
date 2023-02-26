import { Show, TextField, SimpleShowLayout, NumberField } from 'react-admin';

const CourseShow = () => {
    return (
        <Show>
            <SimpleShowLayout>
                <TextField source="id" />
                <NumberField source="totalSemesters" />
            </SimpleShowLayout>
        </Show>
    );
};
export default CourseShow;
