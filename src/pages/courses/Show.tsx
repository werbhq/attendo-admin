import SK from 'pages/source-keys';
import { Show, TextField, SimpleShowLayout, NumberField } from 'react-admin';

const CourseShow = () => {
    return (
        <Show>
            <SimpleShowLayout>
                <TextField source={SK.COURSE("id")}/>
                <NumberField source={SK.COURSE("totalSemesters")} />
            </SimpleShowLayout>
        </Show>
    );
};
export default CourseShow;
