export interface Report {
    id: string;
    email: string;
    regNo: string;
    userName: string;
    name: string;
    rollNo: number;
    attendance: {
        name: string;
        subjectId: string;
        percentage: number;
    }[];
}
