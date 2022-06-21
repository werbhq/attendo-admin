import {
  Show,
  Tab,
  TabbedShowLayout,
  TextField,
  ArrayField,
  ChipField,
  FunctionField,
  SingleFieldList,
} from "react-admin";

export const CourseShow = () => {
  return (
    <Show>
      <TabbedShowLayout>
        <Tab label="summary">
          <TextField source="id" label="Course" />
          <TextField source="totalSemesters" label="TotalSemesters" />
          <ArrayField source="batches">
            <SingleFieldList>
              {/* <ChipField source="sem"   /> */}
              <FunctionField
                render={(record) => (
                  <ChipField record={{ sem: `S${record.sem}` }} source="sem" />
                )}
              />
            </SingleFieldList>
          </ArrayField>
        </Tab>
        <Tab label="Active Semesters">
          
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
};
