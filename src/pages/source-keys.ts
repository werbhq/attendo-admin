import { sourceKey } from 'Utils/source-key';
import { SourceKeys } from 'types/frontend/record-keys';
import { SubjectAttendance } from 'types/models/attendance';
import { Batch } from 'types/models/batch';
import { Classroom } from 'types/models/classroom';
import { Course } from 'types/models/courses';
import { Student } from 'types/models/student';
import { Subject } from 'types/models/subject';
import { AuthorizedTeacher } from 'types/models/teacher';

const SK = {
    ATTENDANCE: sourceKey<SourceKeys<SubjectAttendance>>,
    AUTH_TEACHERS: sourceKey<SourceKeys<AuthorizedTeacher>>,
    BATCHES: sourceKey<SourceKeys<Batch>>,
    CLASSROOM: sourceKey<SourceKeys<Classroom>>,
    SUBJECT: sourceKey<SourceKeys<Subject>>,
    COURSE: sourceKey<SourceKeys<Course>>,
    STUDENT: sourceKey<SourceKeys<Student>>,
};

export default SK;
