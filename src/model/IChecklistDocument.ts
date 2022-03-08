import { ICheckItemAnswered } from "./ICheckItem";

export interface ICategory {
    name: string;
}
export interface IMetadata {
    name: string;
}
export interface IStatus {
    name: string;
    description: string;
}
export interface ISeverity {
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