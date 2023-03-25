import { Show, TabbedShowLayout, useShowController, RecordContextProvider } from 'react-admin';
import { Classroom } from 'types/models/classroom';
import SubjectTab from './tab/SubjectTab';
import ReportTab from './tab/ReportTab';
import StudentTab from './tab/StudentTab';
import SummaryTab from './tab/SummaryTab';

export const ClassroomShow = () => {
    const { record: recordOriginal } = useShowController<Classroom>();

    const record = {
        ...recordOriginal,
        parentClasses: Object.keys(recordOriginal?.parentClasses ?? {}),
        teachers: recordOriginal?.teachers?.map((e) => e.id) ?? [],
    };

    const isNonVirtual = !record.isDerived;

    return (
        <Show emptyWhileLoading>
            <RecordContextProvider value={record}>
                <TabbedShowLayout>
                    <SummaryTab label="summary" />
                    <StudentTab label="students" path="students" />
                    {isNonVirtual && <ReportTab label="reports" path="reports" />}
                    {isNonVirtual && <SubjectTab label="subject" path="subject" />}
                </TabbedShowLayout>
            </RecordContextProvider>
        </Show>
    );
};

export default ClassroomShow;
