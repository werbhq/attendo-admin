import { Timestamp } from 'firebase-admin/firestore';

export interface Meta {
    lastUpdated: Timestamp;
    createdAt: Timestamp;
    version: number;
    deleted: boolean;
}
