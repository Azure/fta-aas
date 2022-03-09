export interface ICheckList {
    name: string;
    languages: string[];
    categories: string[];
}

export interface IParseResult {
    checklists: ICheckList[];
}