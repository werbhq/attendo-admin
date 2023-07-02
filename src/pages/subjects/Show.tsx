import { TextField, Show, Tab, TabbedShowLayout, FunctionField, ReferenceField } from 'react-admin';
import SubjectTable from './components/show/SubjectTable';
import SemesterTable from './components/show/SemesterTable';
import { CustomSemesterField } from './components/CustomFields';
import { SubjectDoc } from 'types/models/subject';
import { MAPPING } from 'provider/mapping';
import SK from 'pages/source-keys';

const SubjectShow = () => {
    return (
        <Show>
            <TabbedShowLayout sx={{ mb: 5 }}>
                <Tab label="summary">
                    <TextField source={SK.SYLLABUS("id")} />
                    <TextField source={SK.SYLLABUS("organization")} />
                    <ReferenceField source={SK.SYLLABUS("course")} reference={MAPPING.COURSES} link="show" />
                    <TextField source={SK.SYLLABUS("year")} />
                    <FunctionField
                        label="Semester"
                        render={(record: SubjectDoc) => <CustomSemesterField record={record} />}
                    />
                </Tab>
                <Tab label="subjects" path="subjects">
                    <SubjectTable />
                </Tab>
                <Tab label="semesters" path="semesters">
                    <SemesterTable />
                </Tab>
            </TabbedShowLayout>
        </Show>
    );
};
export default SubjectShow;
