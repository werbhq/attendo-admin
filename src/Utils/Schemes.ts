import { SubjectDoc } from '../types/models/subject';
import { convertSingleValueListToSelectList } from './helpers';

export class Schemes {
    _schemes: SubjectDoc[];

    constructor(schemeData: SubjectDoc[]) {
        this._schemes = schemeData;
    }

    static classNames = [
        { id: '1', name: '1', isDerived: false },
        { id: '2', name: '2', isDerived: false },
        { id: 'h', name: 'Honors', isDerived: true },
        { id: 'm', name: 'Minors', isDerived: true },
        { id: 'e', name: 'Elective', isDerived: true },
        { id: 'l', name: 'Lab', isDerived: true },
    ];

    derivedClasses = Schemes.classNames.filter((e) => e.isDerived).map((e) => e.id);

    isDerived = (className: string | null) => this.derivedClasses.includes(className ?? '');

    getCourses = () => {
        const courses = new Set<SubjectDoc['course']>();
        this._schemes.forEach((e) => courses.add(e.course));
        return [...courses].map(convertSingleValueListToSelectList);
    };

    getSchemes = (courseId: string | null) => {
        return this._schemes
            .filter(({ course }) => course === courseId)
            .map(({ id }) => id)
            .map(convertSingleValueListToSelectList);
    };

    getBranches = (schemeId: string | null) => {
        const branches = new Set<string>();
        const schemeData = this._schemes.find(({ id }) => id === schemeId);
        schemeData?.semesters?.forEach((sem) => {
            sem.branchSubs.forEach(({ branch }) => branches.add(branch));
        });
        return [...branches].map(convertSingleValueListToSelectList);
    };

    getSemesters = (schemeId: string | null) => {
        const schemeData = this._schemes.find(({ id }) => id === schemeId);
        return (
            schemeData?.semesters?.map(({ semester }) => {
                return { id: semester, name: semester };
            }) || []
        );
    };

    getSubjects = (schemeId: string | null, branchId: string | null, semesterId: number | null) => {
        const schemeData = this._schemes.find(({ id }) => id === schemeId);
        const semesters = schemeData?.semesters?.find(({ semester }) => semester === semesterId);
        const branch = semesters?.branchSubs?.find(({ branch }) => branch === branchId);

        return (
            branch?.subjects?.map(({code, id, name }) => {
                return { id, name ,code};
            }) || []
        );
    };
}
