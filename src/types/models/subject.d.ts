export interface Subject {
    id: string;
    name: string;
    code: string;
}

export interface SubjectBranchSubs {
    branch: string;
    subjects: Subject[]; // Change
}

export interface SubjectSemester {
    semester: number;
    branchSubs: SubjectBranchSubs[];
}

export interface SubjectDoc {
    id: string;
    course: string;
    organization: string;
    year: number;
    semesters: SubjectSemester[];
}

export interface SubjectIndex {
    schemes: {
        [id: string]: SubjectDoc;
    };
}
