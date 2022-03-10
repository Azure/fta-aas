import { ICheckItemAnswered } from "./ICheckItem";
import { ISeverity } from "./ISeverity";
import { IStatus } from "./IStatus";

export interface ICategory {
    name: string;
}
export interface IMetadata {
    [key: string]: string;
}

export interface IChecklistDocument {
    categories: ICategory[];
    items: ICheckItemAnswered[];
    metadata: IMetadata,
    status: IStatus[],
    severities: ISeverity[]
}