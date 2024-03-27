import { ICheckItemAnswered } from "./ICheckItem";
import { ISeverity } from "./ISeverity";
import { IStatus } from "./IStatus";

export interface ICategory {
    name: string;
}

export interface IWaf {
    name: string;
}
export interface IMetadata {
    [key: string]: string;
}

export interface IChecklistDocument {
    categories: ICategory[];
    waf: IWaf[];
    items: ICheckItemAnswered[];
    metadata: IMetadata,
    status: IStatus[],
    severities: ISeverity[]
}