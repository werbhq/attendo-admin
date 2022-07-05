import {
  Show,
  Tab,
  TabbedShowLayout,
  TextField,
  ArrayField,
  ChipField,
  FunctionField,
  SingleFieldList,
  useShowController,
} from "react-admin";

export const CourseShow = () => {
  const { record } = useShowController();

  return (
    <Show>
      <TabbedShowLayout>
        <Tab label="summary">
          <TextField source="id" label="Course" />
          <TextField source="totalSemesters" label="TotalSemesters" />
          <ArrayField source="batches">
            {record.batches.length !== 0 ? (
              <SingleFieldList>
                <FunctionField
                  render={(record) => (
                    <ChipField
                      record={{ sem: `S${record.sem}` }}
                      source="sem"
                    />
                  )}
                />
              </SingleFieldList>
            ) : (
              <>-</>
            )}
          </ArrayField>
        </Tab>
        <Tab label="Active Semesters" path="active_semester"></Tab>
      </TabbedShowLayout>
    </Show>
  );
};
