import {
  TextField,
  Show,
  Tab,
  TabbedShowLayout,
  FunctionField,
  
} from "react-admin";
import SubjectTable from "./components/ShowSubjectTable";
import SemesterTable from "./components/ShowSemesterTable";
import CustomSemesterField from "./components/CustomSemesterField";

const SubjectShow = () => {
  return (
    <Show>
      <TabbedShowLayout sx={{ mb: 5 }}>
        <Tab label="summary">
          <TextField source="id" />
          <TextField source="organization" />

          <TextField source="course" />
          <TextField source="year" />
          <FunctionField
            label="Semester"
            render={(record) => (
              <CustomSemesterField
                {...record}
                array="semesters"
                chip="semester"
              />
            )}
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
