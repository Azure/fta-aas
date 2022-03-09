import { URL } from "url";

export enum Severity {
    High,
    Medium,
    Low
}

export enum Status {
    NotVerified,
    Open,
    Fulfilled,
    NA
}

export interface ICheckItem {
    category: string;
    subcategory: string;
    text: string;
    guid: string;
    ha: number;
    severity: Severity;
    link?: URL;
    graph_success?: string;
    graph_failure?: string;
}

export interface ICheckItemAnswered extends ICheckItem {
    status?: Status;
}