export interface Subject {
    id: string;
    name: string;
    code?: string;
}

export interface SubjectDoc {
    id: string;
    course: 'BTECH' | 'MTECH';
    organization: string;
    year: number;
    semesters: {
        semester: number;
        branchSubs: {
            branch: string;
            subjects: Subject[]; // Change
        }[];
    }[];
}

export interface SubjectIndex {
    schemes: {
        [id: string]: SubjectDoc;
    };
}
