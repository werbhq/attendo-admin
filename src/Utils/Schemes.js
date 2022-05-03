import { convertSingleValueListToSelectList } from "./helpers";

export class Schemes {
  constructor(schemeData) {
    this.schemes = schemeData;
  }

  static classNames = [
    { id: "1", name: "1" },
    { id: "2", name: "2" },
    { id: "h", name: "Honors" },
    { id: "m", name: "Minors" },
    { id: "e", name: "Elective" },
  ];

  derivedClasses = ["h", "m", "e"];

  isDerived = (className) => this.derivedClasses.includes(className);

  getCourses = () => {
    const courses = new Set();
    this.schemes.forEach((e) => courses.add(e.course));
    return [...courses].map(convertSingleValueListToSelectList);
  };

  getSchemes = (courseId) => {
    return this.schemes
      .filter(({ course }) => course === courseId)
      .map(({ id }) => id)
      .map(convertSingleValueListToSelectList);
  };

  getBranches = (schemeId) => {
    const branches = new Set();
    const schemeData = this.schemes.find(({ id }) => id === schemeId);
    schemeData?.semesters?.forEach((sem) => {
      sem.branchSubs.forEach(({ branch }) => branches.add(branch));
    });
    return [...branches].map(convertSingleValueListToSelectList);
  };

  getSemesters = (schemeId) => {
    const schemeData = this.schemes.find(({ id }) => id === schemeId);
    return (
      schemeData?.semesters?.map(({ semester }) => {
        return { id: semester, name: semester };
      }) || []
    );
  };

  getSubjects = (schemeId, branchId, semesterId) => {
    const schemeData = this.schemes.find(({ id }) => id === schemeId);
    const semesters = schemeData?.semesters?.find(
      ({ semester }) => semester === semesterId
    );
    const branch = semesters?.branchSubs?.find(
      ({ branch }) => branch === branchId
    );

    return (
      branch?.subjects?.map(({ id, name }) => {
        return { id, name };
      }) || []
    );
  };
}
