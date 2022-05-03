export interface Subject {
    id: string;
    name: string;
    code?: string;
}

export interface SubjectList {
    id: string;
    course: 'BTECH' | 'MTECH';
    organization: string;
    year: number;
    semesters: {
        semester: number;
        branchSubs: {
            branch: string;
            subjects: Subject[]; //Change
        }[];
    }[];
}
