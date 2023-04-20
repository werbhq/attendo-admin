import SK from 'pages/source-keys';
import { required, number, SimpleForm, NumberInput, TextInput, Edit } from 'react-admin';

const CourseEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput
                    source={SK.COURSE("id")}
                    label="Course Name"
                    format={(e) => e?.toUpperCase() ?? ''}
                    validate={[required()]}
                    disabled={true}
                />
                <NumberInput
                    source={SK.COURSE("totalSemesters")}
                    onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
                    validate={[required(), number('Number Required')]}
                    label="Total Semesters"
                />
            </SimpleForm>
        </Edit>
    );
};
export default CourseEdit;
