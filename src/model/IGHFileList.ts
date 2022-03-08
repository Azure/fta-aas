import { URL } from "url";

export interface ITreeItem {
    path: string;
    url: URL;
}

export interface IGHFileList {
    tree: ITreeItem[];
}