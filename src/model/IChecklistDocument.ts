import { ICheckItemAnswered } from "./ICheckItem";

interface ICategory {
    name: string;
}
interface IMetadata {
    name: string;
}
interface IStatus {
    name: string;
    description: string;
}
interface ISeverity {
    name: string;
    description: string;
}
export interface IChecklistDocument {
    categories: ICategory[];
    items: ICheckItemAnswered[];
    metadata: IMetadata[],
    status: IStatus[],
    severities: ISeverity[]
}