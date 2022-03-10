import { URL } from "url";
import { ISeverity } from "./ISeverity";
import { IStatus } from "./IStatus";


export interface ICheckItem {
    category: string;
    subcategory: string;
    text: string;
    guid: string;
    ha: number;
    severity: ISeverity;
    link?: string;
}

export interface IGraphQResult {
    success?: string,
    compliant?: string,
    fail?: string,
    failure?: string, 
    result?: string,
    id?: string
}

export interface ICheckItemAnswered extends ICheckItem {
    graphQResult?: IGraphQResult;
    status?: IStatus;
    comments?: string;
}