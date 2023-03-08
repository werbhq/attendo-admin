import { TextField, Show, Tab, TabbedShowLayout, FunctionField, ReferenceField } from 'react-admin';
import SubjectTable from './components/show/SubjectTable';
import SemesterTable from './components/show/SemesterTable';
import { CustomSemesterField } from './components/CustomFields';
import { SubjectDoc } from 'types/models/subject';
import { MAPPING } from 'provider/mapping';

const SubjectShow = () => {
    return (
        <Show>
            <TabbedShowLayout sx={{ mb: 5 }}>
                <Tab label="summary">
                    <TextField source="id" />
                    <TextField source="organization" />
                    <ReferenceField source="course" reference={MAPPING.COURSES} link="show" />
                    <TextField source="year" />
                    <FunctionField
                        label="Semester"
                        render={(record: SubjectDoc) => <CustomSemesterField record={record} />}
                    />
                </Tab>
                <Tab label="semesters" path="semesters">
                    <SemesterTable />
                </Tab>
                <Tab label="subjects" path="subjects">
                    <SubjectTable />
                </Tab>
            </TabbedShowLayout>
        </Show>
    );
};
export default SubjectShow;
