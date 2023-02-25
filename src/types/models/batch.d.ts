export interface BatchShort {
    id: string;
    course: string;
    name: string; // Alias Name: B-TECH 2019
    schemeId: string;
    yearOfJoining: number;
}

export interface Batch extends BatchShort {
    running: boolean;
    semester: number;
}

export interface BatchList {
    batches: {
        [id: string]: Batch;
    };
}
