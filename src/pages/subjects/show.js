import {
  TextField,
  Show,
  ArrayField,
  Tab,
  TabbedShowLayout,
  SingleFieldList,
  ChipField,
} from "react-admin";

import SubjectTable from "./components/ShowSubjectTable";
import SemesterTable from "./components/ShowSemesterTable";

export const SubjectShow = () => {
  return (
    <Show>
      <TabbedShowLayout>
        <Tab label="summary">
          <TextField source="id" />
          <TextField source="organization" />
          <TextField source="course" />
          <TextField source="year" />
          <ArrayField source="semesters">
            <SingleFieldList linkType={false}>
              <ChipField source="semester" />
            </SingleFieldList>
          </ArrayField>
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
